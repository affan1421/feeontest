export interface Alert_Message_Model {
    isSnackbar?: boolean,
    isAlert?: boolean,
    AlertProperties?: {
        severity: "error" | "info" | "success" | "warning" | any,
        width: string,
        message: string
    },
    SnackbarProperties?: {
        autoHideDuration?: number,
        noHide?: boolean,
    },
}