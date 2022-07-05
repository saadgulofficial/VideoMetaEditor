package com.videometaeditor;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.BitSet;


public class ReadWriteModule extends ReactContextBaseJavaModule {
    public ReadWriteModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "ReadWrite";
    }

    public int BinaryToInt(String str) {
        int num, binVal, decVal = 0, baseVal = 1, rem;
        num = Integer.parseInt(str);
        binVal = num;
        while (num > 0) {
            rem = num % 10;
            decVal = decVal + rem * baseVal;
            num = num / 10;
            baseVal = baseVal * 2;
        }
        return decVal;
    }

    public int BinaryToInt(char[] binary) {
        String str = "";
        for (char c : binary) {
            str += c;
        }

        /*        0000000011110111*/
        int num, binVal, decVal = 0, baseVal = 1, rem;
        num = Integer.parseInt(str);
        binVal = num;
        while (num > 0) {
            rem = num % 10;
            decVal = decVal + rem * baseVal;
            num = num / 10;
            baseVal = baseVal * 2;
        }
        return decVal;
    }

    public boolean[] booleanArrayFromByte(byte x) {
        boolean bs[] = new boolean[4];
        bs[0] = ((x & 0x01) != 0);
        bs[1] = ((x & 0x02) != 0);
        bs[2] = ((x & 0x04) != 0);
        bs[3] = ((x & 0x08) != 0);
        return bs;
    }

    public String getStringFromByteArray(ArrayList<Byte> settingsData) {

        StringBuilder sb = new StringBuilder();
        for (byte willBeChar : settingsData) {
            sb.append((char) willBeChar);
        }

        return sb.toString();

    }

    @ReactMethod
    public ArrayList<VideoMeta> ReadMetadata(String fileName) throws Throwable {
        Log.i("ReadMetaDataPath", fileName);
        File file = new File(fileName);
        FileInputStream fileInputStream = new FileInputStream(file);
        byte[] buff = new byte[(int) file.length()];
        BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
        bufferedInputStream.read(buff, 0, buff.length);

        int j = 90000;
        int markerIndex = j - 8;
        int mIndex = 0;
        char[] markerArray = new char[8];
        while (markerIndex < j) {
            if (buff[markerIndex++] % 2 == 0)
                markerArray[mIndex] = '0';
            else
                markerArray[mIndex] = '1';
            mIndex++;
        }
        //end reading marker
        int markerCode = BinaryToInt(markerArray);
        if (markerCode != 47)
            return null;

        char[] harr = new char[16];
        j = 90000;
        for (int k = 0; k < 16; k++) {
            int d = buff[j++];
            if (d % 2 == 0)
                harr[k] = '0';
            else
                harr[k] = '1';
        }

        int length = BinaryToInt(harr);
        int total = length * 8;

        ArrayList<Byte> bytes = new ArrayList<Byte>();

        String btext = "";
        for (int k = 0; k < total; k++) {
            byte vbytes = buff[j++];


            boolean[] barr = booleanArrayFromByte(vbytes);

            if (barr[0])
                btext += "1";
            else
                btext += "0";
            if (btext.length() == 8) {
                int val = BinaryToInt(btext);
                bytes.add((byte) val);
                btext = "";
            }
        }

        if (bytes.size() == 0)
            return null;

        String str = getStringFromByteArray(bytes);
        if (str == null) {
            return null;
        }
        if (!str.startsWith("[") && !str.startsWith("{")) {
            return null;
        }
        //if not array
        if (str.startsWith("{"))
            str = "[" + str + "]";

        Type type = new TypeToken<ArrayList<VideoMeta>>() {
        }.getType();
        Gson gson = new Gson();
        return gson.fromJson(str, type);
    }

    @ReactMethod
    public void WriteMetadata(String fileName, ArrayList<VideoMeta> allMeta) throws Throwable {
        Gson gson = new Gson();
        String message = gson.toJson(allMeta);
        int length = message.length();
        char[] lengthBinary = GetBinary(length, 16);

        byte[] mbytes = message.getBytes();

        File file = new File(fileName);
        FileInputStream fileInputStream = new FileInputStream(file);
        byte[] buff = new byte[(int) file.length()];
        BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
        bufferedInputStream.read(buff, 0, buff.length);

        int j = 90000;

        int markerIndex = j - 8;//1 byte marker
        char[] markerBinary = GetBinary(47, 8);
        for (char m : markerBinary
        ) {
            if (m == '1') {
                if (buff[markerIndex] % 2 == 0) {
                    buff[markerIndex]++;
                }
            } else if (m == '0') {
                if (buff[markerIndex] % 2 != 0) {
                    buff[markerIndex]--;
                }
            }
            markerIndex++;
        }
        //for length storage.
        for (int i = 0; i < lengthBinary.length; i++) {
            boolean bitValue = lengthBinary[i] == '1' ? true : false;
            byte vbytes = buff[j];
            boolean[] barr = booleanArrayFromByte(vbytes);
            barr[0] = bitValue;
            byte b;
            b = convertToByteArray(barr)[0];
            buff[j] = b;
            j++;
        }

        char[] cmessage = message.toCharArray();

        //for text message
        for (int i = 0; i < message.length(); i++) {
            int ch = cmessage[i];

            char[] binary = GetBinary(ch, 8);
            for (int k = 0; k < binary.length; k++) {
                boolean bitValue = binary[k] == '1' ? true : false;

                Byte vbytes = buff[j];
                boolean[] barr = booleanArrayFromByte(vbytes);
                barr[0] = bitValue;
                byte b;
                b = convertToByteArray(barr)[0];
                buff[j] = b;
                j++;
            }
        }

        try {
            if (!file.exists()) {
                file.createNewFile();
            }
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(buff);
            fos.close();
        } catch (Exception e) {

        }
    }

    byte[] convertToByteArray(boolean[] bools) {
        BitSet bits = new BitSet(bools.length);
        for (int i = 0; i < bools.length; i++) {
            if (bools[i]) {
                bits.set(i);
            }
        }

        byte[] bytes = new byte[0];
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            bytes = bits.toByteArray();
        }
        if (bytes.length * 8 >= bools.length) {
            return bytes;
        } else {
            return Arrays.copyOf(bytes, bools.length / 8 + (bools.length % 8 == 0 ? 0 : 1));
        }
    }

    public String ToBinary(int n) {
        if (n < 2) return "" + n;

        int divisor = n / 2;
        int remainder = n % 2;

        return ToBinary(divisor) + remainder;
    }

    public char[] GetBinary(int n, int length) {
        String binary = ToBinary(n);
        char[] arr = new char[length];
        char[] barr = binary.toCharArray();
        for (int i = 0; i < arr.length; i++)
            arr[i] = '0';

        int k = 0;
        int start = arr.length - barr.length;
        for (int i = start; i < arr.length; i++)
            arr[i] = barr[k++];

        String str = "";
        for (char c : arr) {
            str += c;
        }

        return arr;
    }
}
