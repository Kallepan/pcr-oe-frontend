export class ERRORS {
    public static ERROR_API = "Die Kommunikation mit der Datenbank hat nicht funktioniert";
    public static ERROR_LOGIN = "Bitte zuerst einloggen";
    public static ERROR_LOGIN_FAILED = "Login fehlgeschlagen";

    public static ERROR_NO_FILE_UPLOADED = "Bitte zuerst eine Datei hochladen";
    public static ERROR_UPLOAD = "Etwas ist beim hochladen der Datei schiefgelaufen";
    public static ERROR_DOWNLOAD = "Etwas ist beim herunterladen schiefgelaufen";

    public static ERROR_INVALID_FORM = "Bitte gültige Parameter eingeben";


    public static ERROR_NOT_SAVED_TO_DB = "Die Änderungen werden nicht gespeichert";

    public static ERROR_UPDATE = "Das Sample konnte nicht gespeichert werden.";

    public static ERROR_NO_SAMPLE = "Es wurde keine Probe zur Tagesnummer/Gennummer gefunden.";

    public static ERROR_TO_MANY_SAMPLES = "Es können maximal 12 Proben gleichzeitig bearbeitet werden.";

    public static INVALID_INPUT = "Die Eingaben sind ungültig";

    public static ERROR_REQUIRED = "Bitte füllen Sie dieses Feld aus";
    public static ERROR_API_GET_STATISTICS = "Die Statistiken konnten nicht geladen werden";

    public static samplesAnalysisErrors = {
        SAMPLE_ANALYSIS_ALREADY_ACTIVE: "Die Probe ist bereits aktiv",
        SAMPLE_ANALYSIS_ALREADY_INACTIVE: "Die Probe ist bereits inaktiv",
        SAMPLE_ANALYSIS_NOT_ACTIVE: "Die Probe ist nicht aktiv",
        SAMPLE_ANALYSIS_NOT_FOUND: "Die Probe wurde nicht gefunden",
        SAMPLE_ANALYSIS_NOT_SAVED: "Die Probe konnte nicht gespeichert werden",
        SAMPLE_ANALYSIS_NO_SAMPLE_SELECTED: "Es wurde keine Probe ausgewählt",
        SAMPLE_ANALYSIS_NO_SAMPLES: "Es wurden keine Proben gefunden",

        NO_RUN_FOUND: "Es wurde kein Lauf gefunden",
    };
}