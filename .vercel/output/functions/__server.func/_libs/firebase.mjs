import "./firebase__auth.mjs";
import { r as registerVersion } from "./firebase__app.mjs";
import "./firebase__logger.mjs";
import "./firebase__firestore.mjs";
import "./firebase__storage.mjs";
var name = "firebase";
var version = "12.12.0";
registerVersion(name, version, "app");
