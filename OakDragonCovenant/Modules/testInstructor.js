const InstructorAgent = require('./instructorAgent');

const instructor = new InstructorAgent("Lorekeeper");
instructor.reportStatus();
instructor.activate();
instructor.addLesson("Sigil Drawing 101");
instructor.addLesson("Legacy Rites");
instructor.listLessons();
instructor.teachLesson("Sigil Drawing 101");
instructor.teachLesson("Unknown Lesson");