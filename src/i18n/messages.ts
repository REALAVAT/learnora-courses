import enCatalog from "../../messages/en/catalog.json";
import enCommon from "../../messages/en/common.json";
import enCourse from "../../messages/en/course.json";
import enHome from "../../messages/en/home.json";
import esCatalog from "../../messages/es/catalog.json";
import esCommon from "../../messages/es/common.json";
import esCourse from "../../messages/es/course.json";
import esHome from "../../messages/es/home.json";

export const messages = {
  en: { ...enCommon, ...enHome, ...enCatalog, ...enCourse },
  es: { ...esCommon, ...esHome, ...esCatalog, ...esCourse },
};
