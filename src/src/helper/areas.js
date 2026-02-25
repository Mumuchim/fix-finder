// areasData.js

// export const areas = [
//     { id: 'collegeLibrary', label: 'College Library', x: 349.5, y: 267.5, width: 380, height: 584, color: 'skyblue' },
//     { id: 'collegeLibrary2', x: 203.5, y: 534.5, width: 146, height: 53, color: 'skyblue' },
//     { id: 'chapel', label: 'Chapel', x: 0.5, y: 267.5, width: 202, height: 111, color: 'lightcoral' },
//     { id: 'areteHall', label: 'Arete Hall', x: 0.5, y: 379.5, width: 202, height: 106, color: 'lightyellow' },
//     { id: 'discussionRoom', label: 'Discussion Room', x: 0.5, y: 486.5, width: 202, height: 98, color: 'lightblue' },
//     { id: 'cafeteria', label: 'Cafeteria', x: 0.5, y: 680.5, width: 202, height: 176, color: 'lightpink' },
//     { id: 'credo', label: 'CREDO', x: 0.5, y: 585.5, width: 202, height: 94, color: 'lightgreen' },
//     { id: 'clinic', label: 'Clinic', x: 136.5, y: 949.5, width: 208, height: 130, color: '#C5DFF8', image: 'img/Clinic.png' },
//     { id: 'guidance', label: 'Guidance', x: 345.5, y: 949.5, width: 87, height: 130, color: '#A0BFE0', image: 'img/Guidance.png' },
//     { id: 'psychLab', label: 'Psych Lab', x: 671.5, y: 949.5, width: 206, height: 130, color: '#7895CB', image: 'img/Psych.png' },
//     { id: 'stairs', label: 'Stairs', x: 878.5, y: 949.5, width: 106, height: 130, color: 'black', image: 'img/Stair.png' },
//     { id: 'comfortRooms', label: 'CR 1', x: 985.5, y: 949.5, width: 94, height: 130, color: '#4A55A2', image: 'img/CR1.png' },
//     { id: 'edTech', label: 'EdTech', x: 878.5, y: 770.5, width: 201, height: 88, color: '#F5EFFF', image: 'img/Edtech.png' },
//     { id: 'sandbox', label: 'Sandbox', x: 878.5, y: 681.5, width: 201, height: 88, color: '#E5D9F2', image: 'img/SandBox.png' },
//     { id: 'nexus', label: 'Nexus', x: 878.5, y: 486.5, width: 201, height: 194, color: '#CDC1FF', image: 'img/Nexus.png' },
//     { id: 'inspireRobotics', label: 'Inspire / Robotics', x: 878.5, y: 267.5, width: 201, height: 218, color: '#A594F9', image: 'img/Robotics.png' },
//     { id: 'simulationRoom', label: 'Simulation Room', x: 878.5, y: 0.5, width: 201, height: 123, color: '#D2E3C8', image: 'img/Simulation.png' },
//     { id: 'lectureRoom4', label: 'Lecture Room 4', x: 666.5, y: 0.5, width: 211, height: 123, color: '#86A789', image: 'img/Lecture Room 4.png' },
//     { id: 'lectureRoom5', label: 'Lecture Room 5', x: 454.5, y: 0.5, width: 211, height: 123, color: '#739072', image: 'img/Lecture Room 5.png' },
//     { id: 'lectureRoom6', label: 'Lecture Room 6', x: 250.5, y: 0.5, width: 203, height: 123, color: '#4F6F52', image: 'img/Lecture Room 6.png' },
//     { id: 'server3Room', label: 'Server Room', x: 166.5, y: 0.5, width: 83, height: 123, color: '#3F6142', image: 'img/Server 3.png' },
//     { id: 'stairs2', label: 'Stairs 2', x: 83.5, y: 0.5, width: 82, height: 123, color: 'black', image: 'img/Stair3.png' },
//     { id: 'comfortRooms2', label: 'CR 2', x: 0.5, y: 0.5, width: 82, height: 123, color: '#4A55A2', image: 'img/CR2.png' },
// ];


// areasData.js
import Library from '../assets/images/Library.png'
import LibraryWay1 from '../assets/images/LibraryWay.png'
import Chapel from '../assets/images/Chapel.png'
import Arete from '../assets/images/Arete.png'
import Discussion from '../assets/images/Discussion.png'
import Cafeteria from '../assets/images/Cafe.png'
import Credo from '../assets/images/Credo.png'
import Guidance from '../assets/images/Guidance.png'
import Psych from '../assets/images/Psych.png'
import Clinic from '../assets/images/Clinic.png'
import Stair from '../assets/images/Stair.png'
import CR1 from '../assets/images/CR1.png'
import Edtech from '../assets/images/Edtech.png'
import Sandbox from '../assets/images/SandBox.png'
import Nexus from '../assets/images/Nexus.png'
import Robotics from '../assets/images/Robotics.png'
import Simulation from '../assets/images/Simulation.png'
import Lecture4 from '../assets/images/Lecture Room 4.png'
import Lecture5 from '../assets/images/Lecture Room 5.png'
import Lecture6 from '../assets/images/Lecture Room 6.png'
import Server3 from '../assets/images/Server 3.png'
import Stair2 from '../assets/images/Stair3.png'
import CR2 from '../assets/images/CR2.png'
import Library2nd from '../assets/images/Library-2ndfloor.png'
import LibraryWay2 from '../assets/images/LibraryWay-2ndfloor.png'
import Scientia2 from '../assets/images/Scientia 2.png'
import Scientia1 from '../assets/images/Scientia 1.png'
import CHS from '../assets/images/CHS.png'
import Skills from '../assets/images/Skills.png'
import Ampi from '../assets/images/Ampitheater.png'
import Chem from '../assets/images/Chem-2ndfloor.png'
import Micro from '../assets/images/Micro-2ndfloor.png'
import Physics from '../assets/images/Physics-2ndfloor.png'
import Anatomy from '../assets/images/Anatomy-2ndfloor.png'
import Lecture7 from '../assets/images/Lecture_Room-2ndfloor.png'
import Lecture8 from '../assets/images/Lecture_Room 2-2ndfloor.png'
import Resource from '../assets/images/Resources.png'
import OVPAA from '../assets/images/OVPA.png'
import OSP from '../assets/images/Huddle.png'
import CR2nd from '../assets/images/CR2-2ndfloor.png'



export const areas1 = [
    { id: 'collegeLibrary', label: 'College Library', x: 349.5, y: 267.5, width: 380, height: 584, color: 'skyblue', image: Library },
    { id: 'collegeLibrary2', x: 203.5, y: 534.5, width: 146, height: 53, color: 'skyblue', image: LibraryWay1 },
    { id: 'chapel', label: 'Chapel', x: 0.5, y: 267.5, width: 202, height: 111, color: 'lightcoral', image: Chapel },
    { id: 'areteHall', label: 'Arete Hall', x: 0.5, y: 379.5, width: 202, height: 106, color: 'lightyellow', image: Arete },
    { id: 'discussionRoom', label: 'Discussion Room', x: 0.5, y: 486.5, width: 202, height: 98, color: 'lightblue', image: Discussion },
    { id: 'cafeteria', label: 'Cafeteria', x: 0.5, y: 680.5, width: 202, height: 176, color: 'lightpink', image: Cafeteria },
    { id: 'credo', label: 'CREDO', x: 0.5, y: 585.5, width: 202, height: 94, color: 'lightgreen', image: Credo },
    { id: 'clinic', label: 'Clinic', x: 136.5, y: 949.5, width: 208, height: 130, color: '#C5DFF8', image: Clinic },
    { id: 'guidance', label: 'Guidance', x: 345.5, y: 949.5, width: 87, height: 130, color: '#A0BFE0', image: Guidance },
    { id: 'psychLab', label: 'Psych Lab', x: 671.5, y: 949.5, width: 206, height: 130, color: '#7895CB', image: Psych },
    { id: 'stairs', label: 'Stairs', x: 878.5, y: 949.5, width: 106, height: 130, color: 'black', image: Stair },
    { id: 'comfortRooms', label: 'CR 1', x: 985.5, y: 949.5, width: 94, height: 130, color: '#4A55A2', image: CR1 },
    { id: 'edTech', label: 'EdTech', x: 878.5, y: 770.5, width: 201, height: 88, color: '#F5EFFF', image: Edtech },
    { id: 'sandbox', label: 'Sandbox', x: 878.5, y: 681.5, width: 201, height: 88, color: '#E5D9F2', image: Sandbox },
    { id: 'nexus', label: 'Nexus', x: 878.5, y: 486.5, width: 201, height: 194, color: '#CDC1FF', image: Nexus },
    { id: 'inspireRobotics', label: 'Inspire / Robotics', x: 878.5, y: 267.5, width: 201, height: 218, color: '#A594F9', image: Robotics },
    { id: 'simulationRoom', label: 'Simulation Room', x: 878.5, y: 0.5, width: 201, height: 123, color: '#D2E3C8', image: Simulation },
    { id: 'lectureRoom4', label: 'Lecture Room 4', x: 666.5, y: 0.5, width: 211, height: 123, color: '#86A789', image: Lecture4 },
    { id: 'lectureRoom5', label: 'Lecture Room 5', x: 454.5, y: 0.5, width: 211, height: 123, color: '#739072', image: Lecture5 },
    { id: 'lectureRoom6', label: 'Lecture Room 6', x: 250.5, y: 0.5, width: 203, height: 123, color: '#4F6F52', image: Lecture6 },
    { id: 'server3Room', label: 'Server 3', x: 166.5, y: 0.5, width: 83, height: 123, color: '#3F6142', image: Server3 },
    { id: 'stairs2', label: 'Stairs 2', x: 83.5, y: 0.5, width: 82, height: 123, color: 'black', image: Stair2 },
    { id: 'comfortRooms2', label: 'CR 2', x: 0.5, y: 0.5, width: 82, height: 123, color: '#4A55A2', image: CR2 },
];

export const areas2 = [
    { id: 'collegeLibrary', label: 'College Library', x: 352.5, y: 268.5, width: 380, height: 584, color: '#4A55A2', image: Library2nd },
    { id: 'collegeLibrary2', x: 203.5, y: 534.5, width: 148, height: 53, color: '#4A55A2', image: LibraryWay2 },
    { id: 'scientiaHall2', label: 'Scientia Hall 2', x: 2.5, y: 949.5, width: 485, height: 130, color: '#C5DFF8', image: Scientia2 },
    { id: 'scientiaHall1', label: 'Scientia Hall 1', x: 488.5, y: 949.5, width: 391, height: 130, color: '#7895CB', image: Scientia1 },
    { id: 'stairs', label: 'Stairs', x: 880.5, y: 949.5, width: 106, height: 130, color: 'black', image: Stair },
    { id: 'comfortRooms', label: 'CR 1', x: 987.5, y: 949.5, width: 94, height: 130, color: '#4A55A2', image: CR1 },
    { id: 'chs', label: 'CHS', x: 880.5, y: 732.5, width: 201, height: 125, color: '#E5D9F2', image: CHS },
    { id: 'skillsLab', label: 'Skills Lab', x: 880.5, y: 377.5, width: 201, height: 354, color: '#CDC1FF', image: Skills },
    { id: 'amphitheater', label: 'Amphitheater', x: 880.5, y: 268.5, width: 201, height: 108, color: '#A594F9', image: Ampi },
    { id: 'chemistry', label: 'Chemistry', x: 880.5, y: 0.5, width: 201, height: 123, color: '#86A789', image: Chem },
    { id: 'microbiology', label: 'Microbiology', x: 667.5, y: 0.5, width: 212, height: 123, color: '#739072', image: Micro },
    { id: 'physics', label: 'Physics', x: 459.5, y: 0.5, width: 207, height: 123, color: '#4F6F52', image: Physics },
    { id: 'anatomy', label: 'Anatomy', x: 210.5, y: 0.5, width: 248, height: 123, color: '#3F6142', image: Anatomy },
    { id: 'stairs2', label: 'Stairs 2', x: 108.5, y: 0.5, width: 101, height: 123, color: 'black', image: Stair2 },
    { id: 'comfortRooms2', label: 'CR 2', x: 2.5, y: 0.5, width: 105, height: 123, color: '#4A55A2', image: CR2nd },
    { id: 'lectureRoom', label: 'Lecture Room', x: 0.5, y: 268.5, width: 202, height: 111, color: '#FFD0D0', image: Lecture7 },
    { id: 'lectureRoom2', label: 'Lecture Room 2', x: 0.5, y: 380.5, width: 202, height: 106, color: '#E1ACAC', image: Lecture8 },
    { id: 'resourcesRoom', label: 'Resources Room', x: 0.5, y: 487.5, width: 202, height: 137, color: '#CA8787', image: Resource },
    { id: 'ovpaa', label: 'OVPAA', x: 0.5, y: 625.5, width: 202, height: 232, color: '#835A5A', image: OVPAA },
    { id: 'ospHuddle', label: 'OSP/Huddle', x: 84.5, y: 625.5, width: 118, height: 106, color: '#A87676', image: OSP }
];

