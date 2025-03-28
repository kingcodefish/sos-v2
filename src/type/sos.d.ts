interface SOSDocument {
  assignment: Assignment
}

interface Assignment {
  $: {
    ident: string;
    title: string;
    sectioncount: string;
    type: string;
    subject: string;
    unit: string;
    mathmode: string;
  };
  references: string[];
  vocab_list: VocabList[];
  section: Section[];
}

interface VocabList {
  vocab_item: VocabItem[];
}

interface VocabItem {
  $: {
    group: string;
  };
  vocab_word: string[];
  vocab_sound: string[];
  vocab_definition: string[];
}

interface Section {
  $: {
    ident: string;
    problemcount: string;
  };
  presentation: Presentation[];
  problem?: Problem[];
}

interface Presentation {
  h1?: Header[];
  h2?: Header[];
  h3?: Header[];
  p?: (string | Paragraph)[];
  br?: string[];
  b?: (string | Bold)[];
  vocab_section?: { $: { group: string } }[];
}

interface Header {
  _: string;
  $: {
    style: string;
  };
  img?: Image[];
  br?: string[];
}

interface Image {
  $: {
    src: string;
    height: string;
    width: string;
  };
}

interface Paragraph {
  _: string;
  b?: string[];
  em?: string[];
  timeline?: Timeline[];
  a?: Link[];
  img?: Image[];
  $?: {
    style: string;
  };
}

interface Bold {
  p?: string[];
  ul?: {
    li: string[];
  }[];
}

interface Timeline {
  _: string;
  $: {
    date: string;
  };
}

interface Link {
  _: string;
  $: {
    href: string;
    target?: string;
  };
  img?: Image[];
}

interface Problem {
  $: {
    ident: string;
    type: string;
    autograded: string;
    pointvalue: string;
  };
  instructions: string[];
  matching?: Matching[];
  text_multiple_choice?: TextMultipleChoice[];
  multiple_choice?: MultipleChoice[];
  problemfeedback: ProblemFeedback[];
}

interface Matching {
  question: { p: { b: string[] }[] }[];
  target_list: {
    item: {
      _: string;
      $: { ident: string };
    }[];
  }[];
  word_list: {
    word: {
      _: string;
      $: { formatting: string };
    }[];
  }[];
  matching_answer: {
    _: string;
    $: { ident: string };
  }[];
}

interface TextMultipleChoice {
  tmc_question: {
    p: {
      _: string;
      tmc_box: {
        $: {
          ident: string;
          size: string;
        };
      }[];
    }[];
  }[];
  text_choices: {
    $: { ident: string };
    text_choice: string[];
  }[];
  text_multiple_choice_answer: {
    _: string;
    $: { ident: string };
  }[];
}

interface MultipleChoice {
  $: {
    alignment: string;
  };
  question: { p: string[] }[];
  choice: {
    _: string;
    $: { value: string };
  }[];
  multiple_choice_answer: {
    $: { value: string };
  }[];
}

interface ProblemFeedback {
  correct_message: string[];
  incorrect_message: string[];
}
