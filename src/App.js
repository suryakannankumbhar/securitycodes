import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

import image1 from './images/image1.png';
import image2 from './images/image2.png';
import image3 from './images/image3.png';
import image4 from './images/image4.png';
import image5 from './images/image5.png';
import image6 from './images/image6.png';

import './App.css';

const TabContent = ({ code, image }) => (
    <div>
        <SyntaxHighlighter language='java' style={nord}>
            {code}
        </SyntaxHighlighter>
        <div className='output-image'>
            <img src={image} alt='Output' />
        </div>
    </div>
);

const Tab = ({ label, content, isActive, onClick }) => (
    <div className={`tab ${isActive ? 'active' : ''}`} onClick={onClick}>
        {label}
        {isActive && <div className='content'>{content}</div>}
    </div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState(null);

    const handleTabClick = index => {
        setActiveTab(prevActiveTab => (prevActiveTab === index ? null : index));
    };

    const tabsData = [
        {
            label: 'Ex 1a - Encryption/Decryption using Caesar Cipher',
            content: (
                <TabContent
                    code={`
                    class CaesarCipher {
                      public static String encode(String enc, int offset) {
                          offset = offset % 26 + 26;
                          StringBuilder encoded = new StringBuilder();
                          for (char i : enc.toCharArray()) {
                              if (Character.isLetter(i)) {
                                  if (Character.isUpperCase(i)) {
                                      encoded.append((char) ('A' + (i - 'A' + offset) % 26));
                                  } else {
                                      encoded.append((char) ('a' + (i - 'a' + offset) % 26));
                                  }
                              } else {
                                  encoded.append(i);
                              }
                          }
                          return encoded.toString();
                      }
                  
                      public static String decode(String enc, int offset) {
                          return encode(enc, 26 - offset);
                      }
                  
                      public static void main(String[] args) throws java.lang.Exception {
                          String msg = "Anna University";
                          System.out.println("Simulating Caesar Cipher------------------------");
                          System.out.println("Input : " + msg);
                          System.out.printf("Encrypted Message : ");
                          System.out.println(CaesarCipher.encode(msg, 3));
                          System.out.printf("Decrypted Message : ");
                          System.out.println(CaesarCipher.decode(CaesarCipher.encode(msg, 3), 3));
                      }
                  }
                  
                    `}
                    image={image1}
                />
            ),
        },
        {
            label: 'Ex 1b - Playfair Cipher',
            content: (
                <TabContent
                    code={`
import java.awt.Point;

class PlayfairCipher {
    private static char[][] charTable;
    private static Point[] positions;

    private static String prepareText(String s, boolean chgJtoI) {
        s = s.toUpperCase().replaceAll("[^A-Z]", "");
        return chgJtoI ? s.replace("J", "I") : s.replace("Q", "");
    }

    private static void createTbl(String key, boolean chgJtoI) {
        charTable = new char[5][5];
        positions = new Point[26];
        String s = prepareText(key + "ABCDEFGHIJKLMNOPQRSTUVWXYZ", chgJtoI);
        int len = s.length();
        for (int i = 0, k = 0; i < len; i++) {
            char c = s.charAt(i);
            if (positions[c - 'A'] == null) {
                charTable[k / 5][k % 5] = c;
                positions[c - 'A'] = new Point(k % 5, k / 5);
                k++;
            }
        }
    }

    private static String codec(StringBuilder txt, int dir) {
        int len = txt.length();
        for (int i = 0; i < len; i += 2) {
            char a = txt.charAt(i);
            char b = txt.charAt(i + 1);
            int row1 = positions[a - 'A'].y;
            int row2 = positions[b - 'A'].y;
            int col1 = positions[a - 'A'].x;
            int col2 = positions[b - 'A'].x;
            if (row1 == row2) {
                col1 = (col1 + dir) % 5;
                col2 = (col2 + dir) % 5;
            } else if (col1 == col2) {
                row1 = (row1 + dir) % 5;
                row2 = (row2 + dir) % 5;
            } else {
                int tmp = col1;
                col1 = col2;
                col2 = tmp;
            }
            txt.setCharAt(i, charTable[row1][col1]);
            txt.setCharAt(i + 1, charTable[row2][col2]);
        }
        return txt.toString();
    }

    private static String encode(String s) {
        StringBuilder sb = new StringBuilder(s);
        for (int i = 0; i < sb.length(); i += 2) {
            if (i == sb.length() - 1) {
                sb.append(sb.length() % 2 == 1 ? 'X' : "");
            } else if (sb.charAt(i) == sb.charAt(i + 1)) {
                sb.insert(i + 1, 'X');
            }
        }
        return codec(sb, 1);
    }

    private static String decode(String s) {
        return codec(new StringBuilder(s), 4);
    }

    public static void main(String[] args) throws java.lang.Exception {
        String key = "CSE";
        String txt = "Security Lab"; /* make sure string length is even */ /* change J to I */
        boolean chgJtoI = true;
        createTbl(key, chgJtoI);
        String enc = encode(prepareText(txt, chgJtoI));
        System.out.println("Simulating Playfair Cipher\n----------------------");
        System.out.println("Input Message : " + txt);
        System.out.println("Encrypted Message : " + enc);
        System.out.println("Decrypted Message : " + decode(enc));
    }
}

                    `}
                    image={image2}
                />
            ),
        },
        {
            label: 'Ex 1c - Hill Cipher',
            content: (
                <TabContent
                    code={`
                    class HillCipher {
                      /* 3x3 key matrix for 3 characters at once */
                      public static int[][] keymat = new int[][] {
                              {1, 2, 1},
                              {2, 3, 2},
                              {2, 2, 1}
                      };
                  
                      /* key inverse matrix */
                      public static int[][] invkeymat = new int[][] {
                              {-1, 0, 1},
                              {2, -1, 0},
                              {-2, 2, -1}
                      };
                  
                      public static String key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                  
                      private static String encode(char a, char b, char c) {
                          String ret = "";
                          int x, y, z;
                          int posa = (int) a - 65;
                          int posb = (int) b - 65;
                          int posc = (int) c - 65;
                  
                          x = posa * keymat[0][0] + posb * keymat[1][0] + posc * keymat[2][0];
                          y = posa * keymat[0][1] + posb * keymat[1][1] + posc * keymat[2][1];
                          z = posa * keymat[0][2] + posb * keymat[1][2] + posc * keymat[2][2];
                  
                          a = key.charAt(x % 26);
                          b = key.charAt(y % 26);
                          c = key.charAt(z % 26);
                  
                          ret = "" + a + b + c;
                          return ret;
                      }
                  
                      private static String decode(char a, char b, char c) {
                          String ret = "";
                          int x, y, z;
                          int posa = (int) a - 65;
                          int posb = (int) b - 65;
                          int posc = (int) c - 65;
                  
                          x = posa * invkeymat[0][0] + posb * invkeymat[1][0] + posc * invkeymat[2][0];
                          y = posa * invkeymat[0][1] + posb * invkeymat[1][1] + posc * invkeymat[2][1];
                          z = posa * invkeymat[0][2] + posb * invkeymat[1][2] + posc * invkeymat[2][2];
                  
                          a = key.charAt((x % 26 < 0) ? (26 + x % 26) : (x % 26));
                          b = key.charAt((y % 26 < 0) ? (26 + y % 26) : (y % 26));
                          c = key.charAt((z % 26 < 0) ? (26 + z % 26) : (z % 26));
                  
                          ret = "" + a + b + c;
                          return ret;
                      }
                  
                      public static void main(String[] args) throws java.lang.Exception {
                          String msg;
                          String enc = "";
                          String dec = "";
                          int n;
                  
                          msg = ("SecurityLaboratory");
                          System.out.println("Simulation of Hill Cipher\n-------------------------");
                          System.out.println("Input message : " + msg);
                  
                          msg = msg.toUpperCase();
                          msg = msg.replaceAll("\\s", ""); /* remove spaces */
                  
                          n = msg.length() % 3; /* append padding text X */
                          if (n != 0) {
                              for (int i = 1; i <= (3 - n); i++) {
                                  msg += 'X';
                              }
                          }
                  
                          System.out.println("Padded message : " + msg);
                  
                          char[] pdchars = msg.toCharArray();
                  
                          for (int i = 0; i < msg.length(); i += 3) {
                              enc += encode(pdchars[i], pdchars[i + 1], pdchars[i + 2]);
                          }
                  
                          System.out.println("Encoded message : " + enc);
                  
                          char[] dechars = enc.toCharArray();
                  
                          for (int i = 0; i < enc.length(); i += 3) {
                              dec += decode(dechars[i], dechars[i + 1], dechars[i + 2]);
                          }
                  
                          System.out.println("Decoded message : " + dec);
                      }
                  }
                  
                  `}
                    image={image3}
                />
            ),
        },
        {
            label: 'Ex 1d - Vigenere Cipher',
            content: (
                <TabContent
                    code={`
                    public class VigenereCipher {
                      static String encode(String text, final String key) {
                          String res = "";
                          text = text.toUpperCase();
                          for (int i = 0, j = 0; i < text.length(); i++) {
                              char c = text.charAt(i);
                              if (c < 'A' || c > 'Z') {
                                  continue;
                              }
                              res += (char) ((c + key.charAt(j) - 2 * 'A') % 26 + 'A');
                              j = ++j % key.length();
                          }
                          return res;
                      }
                  
                      static String decode(String text, final String key) {
                          String res = "";
                          text = text.toUpperCase();
                          for (int i = 0, j = 0; i < text.length(); i++) {
                              char c = text.charAt(i);
                              if (c < 'A' || c > 'Z') {
                                  continue;
                              }
                              res += (char) ((c - key.charAt(j) + 26) % 26 + 'A');
                              j = ++j % key.length();
                          }
                          return res;
                      }
                  
                      public static void main(String[] args) throws java.lang.Exception {
                          String key = "VIGENERECIPHER";
                          String msg = "SecurityLaboratory";
                          System.out.println("Simulating Vigenere Cipher\n------------------------");
                          System.out.println("Input Message : " + msg);
                          String enc = encode(msg, key);
                          System.out.println("Encrypted Message : " + enc);
                          System.out.println("Decrypted Message : " + decode(enc, key));
                      }
                  }
                  
                  `}
                    image={image4}
                />
            ),
        },
        {
            label: 'Ex 3 - Data Encryption Standard (DES)',
            content: (
                <TabContent
                    code={`
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

public class DES {
    public static void main(String[] argv) {
        try {
            System.out.println("Message Encryption Using DES Algorithm\n-------");

            // Generate a DES key
            KeyGenerator keygenerator = KeyGenerator.getInstance("DES");
            SecretKey myDesKey = keygenerator.generateKey();

            // Create a DES cipher
            Cipher desCipher = Cipher.getInstance("DES/ECB/PKCS5Padding");

            // Encryption
            desCipher.init(Cipher.ENCRYPT_MODE, myDesKey);
            byte[] text = "Secret Information ".getBytes();
            System.out.println("Message [Byte Format] : " + text);
            System.out.println("Message : " + new String(text));
            byte[] textEncrypted = desCipher.doFinal(text);
            System.out.println("Encrypted Message: " + textEncrypted);

            // Decryption
            desCipher.init(Cipher.DECRYPT_MODE, myDesKey);
            byte[] textDecrypted = desCipher.doFinal(textEncrypted);
            System.out.println("Decrypted Message: " + new String(textDecrypted));
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | IllegalBlockSizeException | BadPaddingException e) {
            e.printStackTrace();
        }
    }
}

                    `}
                    image={image5}
                />
            ),
        },
        {
            label: 'Ex 7 - SHA-1 Algorithm',
            content: (
                <TabContent
                    code={`
                    import java.security.MessageDigest;

public class SHA1 {
    public static void main(String[] args) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            System.out.println("Message digest object info:\n-----------------");
            System.out.println("Algorithm=" + md.getAlgorithm());
            System.out.println("Provider=" + md.getProvider());
            System.out.println("ToString=" + md.toString());

            String input = "";
            md.update(input.getBytes());
            byte[] output = md.digest();
            System.out.println();
            System.out.println("SHA-1(\"" + input + "\")=" + bytesToHex(output));

            input = "abc";
            md.update(input.getBytes());
            output = md.digest();
            System.out.println();
            System.out.println("SHA-1(\"" + input + "\")=" + bytesToHex(output));

            input = "abcdefghijklmnopqrstuvwxyz";
            md.update(input.getBytes());
            output = md.digest();
            System.out.println();
            System.out.println("SHA-1(\"" + input + "\")=" + bytesToHex(output));

            System.out.println();
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }
    }

    private static String bytesToHex(byte[] b) {
        char[] hexDigit = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
        StringBuilder buf = new StringBuilder();
        for (byte aB : b) {
            buf.append(hexDigit[(aB >> 4) & 0x0f]);
            buf.append(hexDigit[aB & 0x0f]);
        }
        return buf.toString();
    }
}

                    `}
                    image={image6}
                />
            ),
        },
    ];

    return (
        <div className='App'>
            <h1>Codes</h1>
            <div className='tabs'>
                {tabsData.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        content={tab.content}
                        isActive={activeTab === index}
                        onClick={() => handleTabClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
