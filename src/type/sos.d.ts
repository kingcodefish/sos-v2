interface SOSDocument {
  declaration: XMLElement;
  elements: XMLElement[];
}

interface XMLAttributes {
  type: string;
  src: string;
}

interface XMLElement {
  type: string;
  name?: string;
  attributes?: XMLAttributes;
  elements?: XMLElement[];
}

interface XMLText extends XMLElement {
  type: 'text';
  text: string;
}
