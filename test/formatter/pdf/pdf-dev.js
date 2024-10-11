import { ChordProParser, PdfFormatter } from '../../../lib';

const chordpro = `
{title: Kingdom}
{subtitle: (feat. Naomi Raine & Chandler Moore)}
{artist: Maverick City}
{author: Kirk Franklin}
{key: F}
{tempo: 115}
{time: 4/4}
{copyright: © 2022 Let There Be Songs, For Humans Publishing, Maverick City Publishing, Jacob Poole, Lenox Publishing (Admin by Essential Music Publishing) Aunt Gertrude Music Publishing Llc. (Admin by Capitol CMG Publishing) Heritage Worship Publishing, Maverick City Publishing (Admin by Bethel Music) CCLI Song No. 7197853}

{c:Intro (2x)}
[Gm][F][/][/][|][Dbdim7][Dm][/][/][|]

{c:Verse 1 *1}
My [Dm7]heart has always [C/E]longed for something[F] more
I [Dm7]searched the stars to [Bb]knock on Heaven's [F2]door
Cre - [Dm7]ation groans for [C2/E]God to be re [F2]- vealed
[Dm7]Every wound we [Bb]carry will be[F2] healed
My eyes on the [G7/B]Son, Lord Your will be [Bbm6]done

{c:Chorus 1 *2}
Thine is the [Gm]King - [F]dom, the power, the [Dbdim7]glo - [Dm]ry
Forever and [Gm]e - [F]ver, He finished my [Dbdim7]sto - [Dm]ry
We’re singing [Gm]free - [F/A]dom, our testi - [Dbdim7]mo - [Dm]ny
We’ll be singing for - [G13]ev - [Gm7/C]er, a - [F]men[A7(#9)/E][Dm11]
We’ll be [Dm/C]singing for - [G13]ever and [G13(#5)]ever, [Gm7/C] a - [F]men

{c:Verse 2 *3}
[Dm7]Beautiful each [C/E]color that He [F]made
Your [Dm7]love's the only [Bb]remedy for[F2] hate
[Dm7]You'll return to [C2/E]set the pris'ners [F2]free
‘Til [Dm7]then Your will on [Bb]Earth be done in[F2] me
My eyes on the [G7/B]Son, Lord Your will be [Bbm6]done

{c:Chorus 2 *4a}
Thine is the [Gm]King - [F]dom, the power the [Dbdim7]glo - [Dm]ry
Forever and [Gm]e - [F]ver, He finished my [Dbdim7]sto - [Dm]ry
We’re singing [Gm]free - [F/A]dom, our testi - [Dbdim7]mo - [Dm]ny
We’ll be singing for - [G13]ev - [Gm7/C]er, a - [F]men[x]

{c:Chorus 2 *4b}
Thine is the [Gm]King - [F]dom, the power the [Dbdim7]glo - [Dm]ry
Forever and [Gm]e - [F]ver, He finished my [Dbdim7]sto - [Dm]ry
We’re singing [Gm]free - [F/A]dom, our testi - [Dbdim7]mo - [Dm]ny
We’ll be singing for - [G13]ev - [Gm7/C]er, a - [F]men[A7(#9)][Dm11]
We’ll be [Dm7/C]singing for - [G13/B]ever and [G7(#5)]ever, [Gm7/C] a - [F]men[A7(#9)][Dm11]
We’ll be [Dm7/A]singing for - [G13]ev [G13(#5)]- [Gm7/C]er, a - [F]men[A7(#9)/E][Dm11]
We’ll be [Dm7/A]singing for - [G13]ever and [G13(#5)]ever, [Gm7/C] a - [F]men

{c:Interlude 1 (4x) *5}
[Dm7][/][C/E][/][|][F][/][Bb2][/][|]

{c:Bridge (3x) *6-7}
[Dm7] If you've [C/E]ever wondered[F] What [Bb2]Heaven looks like
[Dm7] [C/E] It’s looking like me [F]and you[Bb2]
[Dm7] If you've [C/E]ever questioned[F] What [Bb2]Heaven sounds like
[Dm7] [C2/E] Just let it fill [F]the room[Bb2]

{c:Tag 1 (8x) *8}
[Dm7] [C/E] Just let it fill [F]the room[Bb2]

{c:Tag 2 (4x) *9}
He's coming, He's [x]coming[x][x][x][|][x][x][x]

{c:Tag 3 (8x) *10}
He's coming, He's [Dm7]coming, [C/E] He's coming, He's [F]coming[Bb2]

{c:Interlude 2 (2x) *11}
[Bb2][/][/][/][|][/][/][/][/][|][/][/][/][/][|][/][/][/][/][|]

{c:Tag 4 *12}
[C/Bb]All [F/Bb]hail King [Bbma7]Jesus
[C/Bb]All [F/Bb]hail King [Bbma7]Jesus

{c:Tag 5 (2x) *13}
[C/E]All [F]hail King [Bbma7]Jesus
[C/E]All [F]hail King [Bbma7]Jesus

{c:Tag 6 *14}
[C/E]All [F]hail King [x]Je - [F13]sus[Ebma7]
[Bbma9] All [A7(#5)]hail King [x]Je - [F13]sus[Ebma7]
[Bbma9] All [A7(#5)]hail King [x]Je - [F13]sus[Ebma7]
[Bbma9] All [A7(#5)]hail King [x]Je - [F13]sus[Ebma7]
[Bbma9][|][/][/][/][|][/][/][/][/][|][/][/][/][/][|][/][/][/][|]

{c:Interlude 3 *15}
[Dm7][/][C/E][/][|][Eb/F][F9/A][Bbma9][A7(#9#5)][|]
[Dm9][/][C/E][/D][-][/Db][|][Cm7][F13][Bbma9][/][A7(#9#5)][|]

{c:Tag 7 (4x) *16-17}
[Dm7]If you wanna know [C/E]what Heaven looks [Eb/F]like
Lookin' [F9/A]like me [Bbma9]and   you[A7(#9#5)]
[Dm7]If you wanna know [C/E]what Heav - [Dm7]en [Eb/Db]sounds [Cm7]like
Just let [F13]it  fill [Bbma9]the   room[A7(#9#5)]

{c:Interlude 4 *18}
[Dm9][/][C/E][/][|][F9/A][Bbma9][/][A7(#9#5)][|]
[Dm9][/][C/E][/D][-][/Db][-][/C][|][F13][Bbma9][/][A7(#9#5)][|]

{c:Tag 8 (2x) *19}
If you [Dm9]wanna know [C/E]what Heaven looks like
Lookin' [F9/A]like, lookin' [Bbma9]like  me and [A7(#9#5)]you
If you [Dm9]wanna know [C/E]what Heav - [/D]en [/Db]looks [/C]like
Just [F13]let it, just [Bbma9]let   it fill the [A7(#9#5)]room

{c:Tag 9 *20a}
[Dm9]If you wanna know [C/E]what Heaven looks [Ebma7/F]like
Lookin' [F9/A]like, lookin' [Bbma9]like  me [A7(#9#5)]and      you
[Dm9]If you wanna know [C7/E]what Heav - [/D]en [/Db]sounds [Cm7]like
Just [F13]let it, just [Bbma9]let   it fill the [A7(#9#5)]room

{c:Tag 10 *20b}
[Dm9]If you wanna know [C/E]what Heaven looks [Ebma7/F]like
        F9/A          Bbma9    A7(#9#5)
Lookin' like, lookin' like  me and      you
[Dm9]If you wanna know [C7/E]what Heav - [/D]en [/Db]sounds [Cm7]like
Just [F13]let it, just [Bbma9]let it fill the room
`.substring(1);

const pdfConfig = {
  fonts: {
    title: {
      name: "NimbusSansL-Bol",
      style: "bold",
      weight: 900,
      size: 28,
      color: "black"
    },
    subtitle: {
      name: "NimbusSansL-Reg",
      style: "normal",
      size: 10,
      color: 100
    },
    metadata: {
      name: "NimbusSansL-Reg",
      style: "normal",
      size: 10,
      color: 100
    },
    text: {
      name: "NimbusSansL-Reg",
      style: "normal",
      size: 10,
      color: "black"
    },
    chord: {
      name: "NimbusSansL-Bol",
      style: "bold",
      size: 9,
      color: "black"
    },
    comment: {
      name: "NimbusSansL-Bol",
      style: "bold",
      size: 10,
      color: "black"
    },
    annotation: {
      name: "NimbusSansL-Reg",
      style: "normal",
      size: 10,
      color: "black"
    }
  },
  margintop: 35,
  marginbottom: 0,
  marginleft: 45,
  marginright: 45,
  paragraphSpacing: 15,
  linePadding: 4,
  chordLyricSpacing: 2,
  chordSpacing: 3,
  columnCount: 2,
  columnWidth: 0,
  columnSpacing: 25,
  layout: {
    header: {
      height: 80,
      content: [
        {
          type: "text",
          template: "%{title}",
          style: {
            name: "NimbusSansL-Bol",
            style: "bold",
            size: 28,
            color: "black"
          },
          position: {
            x: "left",
            y: 15
          }
        },
        {
          type: "line",
          style: {
            color: "black",
            width: 2,
            dash: [
              0,
              5
            ]
          },
          position: {
            x: 0,
            y: 25,
            width: "auto"
          }
        },
        {
          type: "text",
          template: "www.praisecharts.com{?x_pcid}/%{x_pcid}{/x_pcid}",
          style: {
            name: "NimbusSansL-Reg",
            style: "normal",
            size: 10,
            color: "black"
          },
          position: {
            x: "left",
            y: 38
          }
        },
        {
          type: "text",
          template: "{?key}Key: %{key}{/key}{?tempo} · Tempo: %{tempo}{/tempo}{?time} · Time: %{time}{/time}",
          style: {
            name: "NimbusSansL-Reg",
            style: "normal",
            size: 10,
            color: "black"
          },
          position: {
            x: "right",
            y: 38
          },
          condition: {
            or: [
              {
                key: {
                  exists: true
                }
              },
              {
                tempo: {
                  exists: true
                }
              },
              {
                time: {
                  exists: true
                }
              }
            ]
          }
        },
        {
          type: "text",
          template: "Page %{currentPage} of %{totalPages}",
          style: {
            name: "NimbusSansL-Reg",
            style: "normal",
            size: 10,
            color: "black"
          },
          position: {
            x: "right",
            y: 50
          },
          condition: {
            and: [
              {
                totalPages: {
                  greater_than: 1
                }
              },
            ]
          }
        },
        {
          type: "text",
          template: "%{artist}",
          style: {
            name: "NimbusSansL-Reg",
            style: "normal",
            size: 10,
            color: "black"
          },
          position: {
            x: "left",
            y: 50
          }
        }
      ]
    },
    footer: {
      height: 50,
      content: [
        {
          type: "text",
          template: "%{copyright}",
          style: {
            name: "NimbusSansL-Reg",
            style: "normal",
            size: 7,
            color: "black",
            lineHeight: 1.2
          },
          position: {
            x: "left",
            y: 0,
            width: 360
          },
          condition: {
            and: [
              {
                page: {
                  first: true
                }
              },
            ]
          }
        },
        {
          type: 'image',
          src: 'data:image/jpeg;base64,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',
          position: { x: 'right', y: -10 },
          compression: 'none',
          size: { width: 137, height: 24 },
        },
      ]
    }
  }
};
// // Initialize CodeMirror instance
const editor = CodeMirror(document.getElementById('editor'), {
  mode: 'javascript',
  lineNumbers: true,
  value: chordpro,
});

editor.setSize('100%', '49vh');

const pdfConfigString = JSON.stringify(pdfConfig, null, 4);

const configEditor = CodeMirror(document.getElementById('configEditor'), {
  mode: 'javascript',
  lineNumbers: true,
  value: pdfConfigString,
});

configEditor.setSize('100%', '49vh');

// Function to render PDF in an <iframe> or <object>
const renderPDFInBrowser = async (pdfBlob) => {
  const pdfContainer = document.getElementById('pdfViewer');
  pdfContainer.innerHTML = ''; // Clear previous content
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  const blobUrl = URL.createObjectURL(pdfBlob); // Create a URL representing the Blob object
  iframe.src = blobUrl; // Use the Blob URL as the source for the iframe
  pdfContainer.appendChild(iframe);
};

// Function to update the PDF based on the editor content
const updatePDF = async (chordProText) => {
  const song = new ChordProParser().parse(chordProText, {softLineBreaks:true});
  const formatter = new PdfFormatter();
  formatter.format(song, JSON.parse((configEditor.getValue())));
  const pdfBlob = await formatter.generatePDF();
  renderPDFInBrowser(pdfBlob);
};
// Listen for changes in the editor
editor.on('change', (cm) => {
  updatePDF(cm.getValue());
});

configEditor.on('change', (cm) => {
  updatePDF(editor.getValue());
});

// Initial rendering
updatePDF(editor.getValue());
