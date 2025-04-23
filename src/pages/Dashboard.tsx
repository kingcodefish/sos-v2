import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBible, faBook, faCalculator, faFlask, faFlaskVial, faGlobe, faListNumeric, faWater } from "@fortawesome/free-solid-svg-icons";
import { TreeView, TreeDataItem } from '@/components/tree-view';
import { useNavigate } from "react-router";

const globeIcon = ({ className }: {className: string}) => <FontAwesomeIcon icon={faGlobe} className={className} />;
const litIcon = ({ className }: {className: string}) => <FontAwesomeIcon icon={faBook} className={className} />;

const Dashboard = () => {
  const navigate = useNavigate();

  const assignmentData = [
    {
      id: '1',
      name: 'LESSON 1: Test',
      subject: 'World History',
      icon: faGlobe,
      color: 'text-green-300',
      assignment: '//QNAP/School/SOS/AOP.COM.History.10WorldHistory.2013/WorldHistory2013/3/hiswldu03l3.sos',
    },
    {
      id: '2',
      name: 'LESSON 1: Test',
      subject: 'English Literature',
      icon: faBook,
      color: 'text-yellow-300',
      assignment: '//QNAP/School/SOS/AOP.COM.English Language Arts.10EnglishII.2013/EnglishII2013/3/laneng02u03l3.sos',
    },
    {
      id: '3',
      name: 'LESSON 1: Test',
      subject: 'Algebra II',
      icon: faCalculator,
      color: 'text-red-300',
      assignment: '//QNAP/School/SOS/AOP.COM.Mathematics.11ALGEBRAII.2014/AlgebraII2014/3/g_alg02u03c01l01d.sos',
    },
    {
      id: '4',
      name: 'LESSON 1: Test',
      subject: 'New Testament Survey',
      icon: faBible,
      color: 'text-blue-300',
      assignment: '//QNAP/School/SOS/AOP.COM.English Language Arts.10EnglishII.2013/EnglishII2013/3/laneng02u03l3.sos',
    },
    {
      id: '5',
      name: 'LESSON 1: Test',
      subject: 'Integrated Physics and Chemistry',
      icon: faFlask,
      color: 'text-cyan-300',
      assignment: '//QNAP/School/SOS/AOP.COM.English Language Arts.10EnglishII.2013/EnglishII2013/3/laneng02u03l3.sos',
    },
  ];
  
  const lessonPlanData: TreeDataItem[] = [
    {
      id: '1',
      name: 'World History',
      icon: globeIcon,
      children: [
        {
          id: '2',
          name: 'Unit 1: Test Unit',
          children: [
            {
              id: '3',
              name: 'Lesson 1: Test Lesson',
            },
            {
              id: '4',
              name: 'Lesson 2: Test Lesson',
            },
          ],
        },
        {
          id: '5',
          name: 'Unit 2: Test Unit',
        },
      ],
    },
    {
      id: '6',
      name: 'English Literature',
      icon: litIcon,
      children: [
        {
          id: '2',
          name: 'Unit 1: Test Unit',
          children: [
            {
              id: '3',
              name: 'Lesson 1: Test Lesson',
            },
            {
              id: '4',
              name: 'Lesson 2: Test Lesson',
            },
          ],
        },
        {
          id: '5',
          name: 'Unit 2: Test Unit',
        },
      ],
    },
  ];

  return (
    <div className="w-screen h-screen flex">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="min-w-[250px]">
          <h3 className="text-center">Assignments</h3>
          <hr />
          <ScrollArea className="h-screen p-2">
            {assignmentData.map(assignment => 
              <div onDoubleClick={() => {navigate('lesson?q=' + assignment.assignment)}} className="flex gap-4 items-center px-4 p-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-900">
                <FontAwesomeIcon icon={assignment.icon} className={assignment.color} />
                <div className="flex flex-col">
                  <span className="font-bold">{assignment.name}</span>
                  <span>{assignment.subject}</span>
                </div>
              </div>
            )}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <h3 className="text-center mb-0">Lesson Plan</h3>
          <ScrollArea className="h-screen p-2">
            <TreeView data={lessonPlanData} />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;