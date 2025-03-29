import { useEffect, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';
import { ThemeProvider } from './ThemeProvider';
import { cn } from './lib/utils';

const Vocabulary = ({ vocab_list }: { vocab_list: VocabList }) => {
  return (
    <div className="flex flex-col max-w-[800px] mx-auto">
      <h3 className="tracking-widest uppercase bg-gray-700 mb-0">Vocabulary</h3>
      <div className="grid grid-cols-4 gap-2 bg-gray-800 p-6 px-10">
        {vocab_list.vocab_item.map(word => (
          <>
            <span className="font-bold mr-auto mb-auto cursor-pointer hover:opacity-60 transition-all"
              onClick={() => {
                window.ipcRenderer.invoke('text-to-speech', word.vocab_word[0]);
              }}>{word.vocab_word[0]}</span>
            <span className="text-left col-span-3">{word.vocab_definition[0]}</span>
          </>
        ))}
      </div>
    </div>
  );
};

const StyleAdjuster = ({ fontFamily, setFontFamily, fontSize, setFontSize }) => {
  const [open, setOpen] = useState(false);

  return (
    open ?
    <div className="fixed left-4 bottom-4 rounded-lg bg-gray-900 flex flex-col p-4 gap-2 select-none items-center">
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
    </div>
    : <div onClick={() => setOpen(true)} className="fixed left-4 bottom-4 rounded-lg bg-gray-800 p-2 text-sm select-none cursor-pointer transition-all hover:opacity-80">Aa</div>
  );
};

function App() {
  const [xmlDoc, setXmlDoc] = useState<SOSDocument | null>(null);

  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [fontSize, setFontSize] = useState('large');

  useEffect(() => {
    window.ipcRenderer.invoke('read-sos-file', '//QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/WorldHistory2013/3/hiswldu03l3.sos')
      .then((data) => {
        setXmlDoc(data);
        console.log(data);
      });
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="text-center w-screen">
        {xmlDoc ?
        <>
          <div className="w-full from-green-500 to-green-700 tracking-widest bg-gradient-to-b min-h-[150px] flex flex-col justify-center">
            <h1 className="my-0">WORLD HISTORY</h1>
            {/* <img src={'file://QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/Globimag/hiswld_hdr.jpg'} /> */}
          </div>
          <h5 className="text-gray-400 mb-0">{xmlDoc.assignment.section[0].presentation[0].h3![1]._} &ndash; {xmlDoc.assignment.section[0].presentation[0].h2![0]._}</h5>
          <h2 className="mt-2">{xmlDoc.assignment.section[0].presentation[0].h1![0]._}</h2>
        </> : <></>}
        {xmlDoc && xmlDoc.assignment.vocab_list.length > 0 ?
          <Vocabulary vocab_list={xmlDoc.assignment.vocab_list[0]} />
          : <></>}
        {xmlDoc ?
        <div className={cn("text-justify mt-16 max-w-[650px] font-light leading-relaxed mx-auto text-lg",
          fontFamily === 'Noto Serif' ? 'font-[\'Noto_Serif\']' : fontFamily === 'Playfair Display' ? 'font-[\'Playfair_Display\']' : 'font-[\'Montserrat\']',
          fontSize === 'small' ? 'text-sm' : fontSize === 'medium' ? 'text-base' : 'text-lg')}>
          {xmlDoc.assignment.section[1].presentation![0].p!.map(section => (
            <p>{typeof section === "string" ? section : section._}</p>
          ))}
        </div>
        : <></>}
        <StyleAdjuster fontFamily={fontFamily} setFontFamily={setFontFamily} fontSize={fontSize} setFontSize={setFontSize} />
      </div>
    </ThemeProvider>
  )
}

export default App