import { ReactHTMLElement, useEffect, useLayoutEffect, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { ThemeProvider } from './ThemeProvider';
import { cn } from './lib/utils';

const parseText = (text: XMLText) => {
  return text.text;
};

interface VocabItem {
  word: string;
  definition: string;
  sound: string;
}

let vocabulary: VocabItem[] = [];

const parseElement = (el: XMLElement, fontFamily: string, fontSize: string) => {
  switch (el.name)
  {
    case 'vocab_item':
    {
      console.trace('vocab_item');
      let vocabItem: VocabItem = {
        word: '',
        definition: '',
        sound: ''
      };
      el.elements?.forEach((el) => {
        if (el.name === 'vocab_word')
          vocabItem.word = (el.elements![0] as XMLText).text;
        else if (el.name === 'vocab_sound')
          vocabItem.sound = (el.elements![0] as XMLText).text;
        else if (el.name === 'vocab_definition')
          vocabItem.definition = (el.elements![0] as XMLText).text;
      });
      vocabulary.push(vocabItem);
      return <></>;
    }
    case 'vocab_section':
    {
      // This is placed in the middle of the article and sources vocabulary words from
      // outside the section. We tunnel from here. Probably should be cleaner than this.
      return (
        <div className="flex flex-col max-w-[800px] mx-auto">
          <h3 className="tracking-widest uppercase bg-gray-700 mb-0 text-center">Vocabulary</h3>
          <div className="grid grid-cols-4 gap-2 bg-gray-800 p-6 px-10">
            {vocabulary.map(vocabItem => (
              <>
                <span className="font-bold mr-auto mb-auto cursor-pointer hover:opacity-60 transition-all"
                  onClick={(e) => {
                    window.ipcRenderer.invoke('text-to-speech', vocabItem.word);
                  }}>
                  {vocabItem.word}
                </span>
                <span className="text-left col-span-3">
                  {vocabItem.definition}
                </span>
              </>
            ))}
          </div>
        </div>
      );
    }
    case 'section':
    {
      return (
        <div className={cn("text-justify mt-16 max-w-[650px] font-light leading-relaxed mx-auto text-lg",
            fontFamily === 'Noto Serif' ? 'font-[\'Noto_Serif\']' : fontFamily === 'Playfair Display' ? 'font-[\'Playfair_Display\']' : 'font-[\'Montserrat\']',
            fontSize === 'small' ? 'text-sm' : fontSize === 'medium' ? 'text-base' : 'text-lg')}>
          {el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}
        </div>
      );
    }
    case 'h1':
    {
      return (
        <h1>{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</h1>
      );
    }
    case 'h2':
    {
      return (
        <h2 className="text-center">{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</h2>
      );
    }
    case 'h3':
    {
      return (
        <h3>{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</h3>
      );
    }
    case 'p':
    {
      return (
        <p>{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</p>
      );
    }
    case 'b':
    {
      return (
        <strong>{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</strong>
      );
    }
    case 'ul':
    {
      return (
        <ul>{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</ul>
      );
    }
    case 'li':
    {
      return (
        <li>{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</li>
      );
    }
    case 'timeline':
    {
      return (
        <a>{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</a>
      );
    }
    case 'img':
    {
      return (
        <img src={el.attributes.src.indexOf('../../') !== -1 ? 'file://QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/' + el.attributes.src.slice(6) : 'file://QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/WorldHistory2013/3/' + el.attributes.src}></img>
      );
    }
    case 'vocab_sound':
/*     case 'problem':
      // Discard
      return <></>; */
    default:
    {
      return (
        <>
          {el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}
        </>
      );
    }
  }
};

const parseNode = (node: XMLElement | XMLText, fontFamily: string, fontSize: string): JSX.Element | string => {
  return node.type === 'element' ?
    parseElement(node, fontFamily, fontSize) : node.type === 'text' ? parseText(node as XMLText)
    : <></>;
};

const parseSosDocument = (doc: SOSDocument, fontFamily: string, fontSize: string) => {
  vocabulary = [];
  return doc.elements.map(node => parseNode(node, fontFamily, fontSize));
  // return (
  //   {xmlDoc && xmlDoc.elements.length > 1 ?
  //   <>
  //     <div className="w-full from-green-500 to-green-700 tracking-widest bg-gradient-to-b min-h-[150px] flex flex-col justify-center">
  //       <h1 className="my-0">WORLD HISTORY</h1>
  //       {/* <img src={'file://QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/Globimag/hiswld_hdr.jpg'} /> */}
  //     </div>
  //     <h5 className="text-gray-400 mb-0">{xmlDoc.elements[1].section[0].presentation[0].h3![1]._} &ndash; {xmlDoc.assignment.section[0].presentation[0].h2![0]._}</h5>
  //     <h2 className="mt-2">{xmlDoc.elements[1].section[0].presentation[0].h1![0]._}</h2>
  //   </> : <></>}
  //   {xmlDoc && xmlDoc.assignment.vocab_list.length > 0 ?
  //     <Vocabulary vocab_list={xmlDoc.assignment.vocab_list[0]} />
  //     : <></>}
  //   {xmlDoc ?
  //   <div className={cn("text-justify mt-16 max-w-[650px] font-light leading-relaxed mx-auto text-lg",
  //     fontFamily === 'Noto Serif' ? 'font-[\'Noto_Serif\']' : fontFamily === 'Playfair Display' ? 'font-[\'Playfair_Display\']' : 'font-[\'Montserrat\']',
  //     fontSize === 'small' ? 'text-sm' : fontSize === 'medium' ? 'text-base' : 'text-lg')}>
  //     {parseContent(xmlDoc.assignment.section[1].presentation![0])}
  //   </div>
  //   : <></>}
  // );
};

// const Vocabulary = ({ vocab_list }: { vocab_list: VocabList }) => {
//   return (
//         {vocab_list.vocab_item.map(word => (
//           <>
//             <span className="font-bold mr-auto mb-auto cursor-pointer hover:opacity-60 transition-all"
//               onClick={() => {
//                 window.ipcRenderer.invoke('text-to-speech', word.vocab_word[0]);
//               }}>{word.vocab_word[0]}</span>
//             <span className="text-left col-span-3">{word.vocab_definition[0]}</span>
//           </>
//         ))}
//   );
// };

const StyleAdjuster = ({ fontFamily, setFontFamily, fontSize, setFontSize } : {
  fontFamily: string,
  setFontFamily: React.Dispatch<React.SetStateAction<string>>,
  fontSize: string,
  setFontSize: React.Dispatch<React.SetStateAction<string>>,
}) => {

  return (
    <Popover>
      <PopoverTrigger className="fixed left-4 bottom-4 rounded-lg bg-gray-800 p-2 text-sm select-none cursor-pointer transition-all hover:opacity-80">Aa</PopoverTrigger>
      <PopoverContent align="start" className="fixed left-0 bottom-0 rounded-lg bg-gray-900 flex flex-col p-4 gap-2 select-none items-center w-40 h-30">
        <ToggleGroup type="single" value={fontFamily} onValueChange={setFontFamily}>
          <ToggleGroupItem value="Montserrat" className="font-[Montserrat]">Aa</ToggleGroupItem>
          <ToggleGroupItem value="Noto Serif" className="font-['Noto_Serif']">Aa</ToggleGroupItem>
          <ToggleGroupItem value="Playfair Display" className="font-['Playfair_Display']">Aa</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" value={fontSize} onValueChange={setFontSize}>
          <ToggleGroupItem value="small" className="text-sm">Sm</ToggleGroupItem>
          <ToggleGroupItem value="medium" className="text-base">Md</ToggleGroupItem>
          <ToggleGroupItem value="large" className="text-lg">Lg</ToggleGroupItem>
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
};

function App() {
  const [xmlDoc, setXmlDoc] = useState<SOSDocument | null>(null);

  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [fontSize, setFontSize] = useState('large');

  useEffect(() => {
    window.ipcRenderer.invoke('read-sos-file', '//QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/WorldHistory2013/3/hiswldu03l3.sos')
      .then((data) => {
        setXmlDoc(JSON.parse(data));
      });
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="text-center w-screen">
        {xmlDoc ? parseSosDocument(xmlDoc, fontFamily, fontSize) : <></>}
        <StyleAdjuster fontFamily={fontFamily} setFontFamily={setFontFamily} fontSize={fontSize} setFontSize={setFontSize} />
      </div>
    </ThemeProvider>
  )
}

export default App