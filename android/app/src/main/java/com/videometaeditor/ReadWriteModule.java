package com.videometaeditor;

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
import java.lang.reflect.Type;
import java.util.ArrayList;



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
}
