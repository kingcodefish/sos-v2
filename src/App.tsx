import { ReactHTMLElement, useEffect, useLayoutEffect, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { ThemeProvider, useTheme } from './ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from './lib/utils';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';

const parseText = (text: XMLText) => {
  return text.text;
};

interface VocabItem {
  word: string;
  definition: string;
  sound: string;
}

interface Problem {
  type: "Matching" | "MultipleChoice";
  autograded: "yes" | "no";
  pointvalue: number;
  words: string[];
  targets: string[];
}

let vocabulary: VocabItem[] = [];
let problems: Problem[] = [];

const parseMatchingProblem = (el: XMLElement) => {
  return {
    type: "Matching",
    autograded: "yes",
    pointvalue: 8,
    words: ["word1", "word2"],
    targets: ["definition1", "definition2"],
    answers: ["word1", "word2"],
  };
};

const parseMultipleChoiceProblem = (el: XMLElement) => {
  return {
    type: "MultipleChoice",
    autograded: "yes",
    pointvalue: 1,
    question: "The greatest scholar brought to Charlemagne's court came from:",
    answer: "V1",
    choices: [{
      value: "V1",
      text: "England"
    },
    {
      value: "V2",
      text: "Ireland"
    },
    {
      value: "V3",
      text: "Rome"
    }],
  };
};

const parseProblem = (el: XMLElement) => {
  console.log(el);
  if (el.attributes.type === 'Matching')
    return parseMatchingProblem(el);
  else if (el.attributes.type === 'MultipleChoice')
    return parseMultipleChoiceProblem(el);
  return {};
};

const parseElement = (el: XMLElement, fontFamily: string, fontSize: string) => {
  switch (el.name)
  {
    case 'presentation':
    {
      return (
        <>
          <div className="w-screen -translate-x-[calc(50vw-325px)] text-white text-center from-green-500 to-green-700 tracking-widest bg-gradient-to-b min-h-[150px] flex flex-col justify-center">
            <h1 className="my-0">WORLD HISTORY</h1>
          </div>
          {el.elements && el.elements.filter((_el, i) => i != 0).map(el => parseNode(el, fontFamily, fontSize))}
        </>
      );
    }
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
        <div className="flex flex-col w-[800px] -translate-x-[75px] mx-auto mb-10">
          <h3 className="tracking-widest uppercase dark:bg-gray-700 bg-slate-300 mb-0 text-center">Vocabulary</h3>
          <div className="grid grid-cols-4 gap-2 dark:bg-gray-800 bg-slate-200 p-6 px-10">
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
        <div className={cn("text-justify w-[650px] mb-20 dark:font-light leading-relaxed mx-auto text-lg",
            fontFamily === 'Noto Serif' ? 'font-[\'Noto_Serif\']' : fontFamily === 'Playfair Display' ? 'font-[\'Playfair_Display\']' : 'font-[\'Montserrat\']',
            fontSize === 'small' ? 'text-sm' : fontSize === 'medium' ? 'text-base' : 'text-lg')}>
          {el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}
          <div className="dark:text-gray-800 text-gray-300 mt-10 text-center font-bold">
            Continue to the next page.
          </div>
        </div>
      );
    }
    case 'h1':
    {
      return (
        <h1 className="text-center">{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</h1>
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
        <h3 className="text-center">{el.elements && el.elements.map(el => parseNode(el, fontFamily, fontSize))}</h3>
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
      // Filter out headers

      // Filter out vocabulary images
      if (el.attributes.src === "../../Globimag/VOC!107.gif")
        return <></>;

      return (
        <div className="text-center">
          <img src={el.attributes.src.indexOf('../../') !== -1 ? 'file://QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/' + el.attributes.src.slice(6) : 'file://QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/WorldHistory2013/3/' + el.attributes.src}></img>
        </div>
      );
    }
    case 'vocab_sound':
    case 'problem':
      problems.push(parseProblem(el));
      // Discard
      return <></>;
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
  problems = [];
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

const ModeToggle = () => {
  const { setTheme } = useTheme();
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="fixed left-16 bottom-4 bg-gray-800" asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Problem = ({ problem }: {problem: Problem}) => {
  if (problem.type === 'Matching') {
    return (
      <>Matching</>
    );
  }
  else if (problem.type === 'MultipleChoice') {
    return (
      <>
      <div>{problem.question}</div>
      <RadioGroup defaultValue="V1">
        {problem.choices.map(choice => {
          return (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={choice.value} id={choice.value} />
              <Label htmlFor={choice.value}>{choice.text}</Label>
            </div>
          );
        })}
      </RadioGroup>
      </>
    );
  }
  else {
    return(
      <>Unknown Problem</>
    );
  }
};

const Problems = () => {
  const [problem, setProblem] = useState(2);

  return (
    <Drawer>
      <DrawerTrigger className="fixed bottom-4 right-4">Problems</DrawerTrigger>
      <DrawerContent className="px-10">
        <DrawerHeader>
          <div className="flex flex-row gap-2 items-center">
            <DrawerTitle className="mr-4">Problems</DrawerTitle>
            <div className="flex flex-row gap-2 items-center">
              {problems.map((_p, i) => {
                return (
                  <Button onClick={() => setProblem(i)} className={cn("dark:bg-gray-800 bg-gray-400 dark:text-white", i == problem ? "dark:bg-gray-600 bg-gray-600": "")}>{i}</Button>
                );
              })}
            </div>
          </div>
        </DrawerHeader>
        <DrawerFooter className="mb-[300px]">
          <Problem problem={problems[problem]} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
        <ModeToggle />
        <Problems />
      </div>
    </ThemeProvider>
  )
}

export default App