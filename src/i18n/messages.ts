import enCatalog from "../../messages/en/catalog.json";
import enCommon from "../../messages/en/common.json";
import enCourse from "../../messages/en/course.json";
import enHome from "../../messages/en/home.json";
import enLearn from "../../messages/en/learn.json";
import enMarketing from "../../messages/en/marketing.json";
import enTeach from "../../messages/en/teach.json";
import esCatalog from "../../messages/es/catalog.json";
import esCommon from "../../messages/es/common.json";
import esCourse from "../../messages/es/course.json";
import esHome from "../../messages/es/home.json";
import esLearn from "../../messages/es/learn.json";
import esMarketing from "../../messages/es/marketing.json";
import esTeach from "../../messages/es/teach.json";

export const messages = {
  en: { ...enCommon, ...enHome, ...enCatalog, ...enCourse, ...enMarketing, ...enLearn, ...enTeach },
  es: { ...esCommon, ...esHome, ...esCatalog, ...esCourse, ...esMarketing, ...esLearn, ...esTeach },
};
