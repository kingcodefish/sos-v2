import { useEffect, useState } from 'react'
import './App.css'


interface VocabWord {
  $: {
    group: string;
  };
  vocab_definition: string[];
  vocab_sound: string[];
  vocab_word: string[];
}

interface SOSDocument {
  assignment: {
    $: {};
    references: string[];
    section: string[];
    vocab_list: {
      vocab_item: VocabWord[];
    }[];
  }
}

function App() {
  const [xmlDoc, setXmlDoc] = useState<SOSDocument | null>(null);

  useEffect(() => {
    console.log("Hello");
    window.ipcRenderer.invoke('read-sos-file', '')
      .then((data) => {
        setXmlDoc(data);
        console.log(data);
      });
  }, []);

  return (
    <div className='App'>
      {xmlDoc ? <ul>
        {xmlDoc.assignment.vocab_list[0].vocab_item.map(word => <li>{word.vocab_word[0]}</li>)}
      </ul> : <></>}
    </div>
  )
}

export default App