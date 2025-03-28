import { useEffect, useState } from 'react'

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

function App() {
  const [xmlDoc, setXmlDoc] = useState<SOSDocument | null>(null);

  useEffect(() => {
    window.ipcRenderer.invoke('read-sos-file', '//QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/WorldHistory2013/3/hiswldu03l3.sos')
      .then((data) => {
        setXmlDoc(data);
        console.log(data);
      });
  }, []);

  return (
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
      <div className="text-justify mt-16 max-w-[650px] font-light leading-relaxed mx-auto text-lg">
        {xmlDoc.assignment.section[1].presentation![0].p!.map(section => (
          <p>{typeof section === "string" ? section : section._}</p>
        ))}
      </div>
      : <></>}
    </div>
  )
}

export default App