export type Sample = {
    sample_id: string;
    full_name: string;
    birthdate: string;
    created_at: string;
    created_by: string;
    material: string;
    sputalysed: boolean;
    comment?: string;

    // Custom attributes
    displaySampleId?: string;
}

export interface Panel {
    readonly panel_id: string,
    readonly ready_mix: boolean,
    readonly display_name: string,

    // Custom attributes for admin
    disabled?: boolean,
    hidden?: boolean,
}

export type Control = {
    readonly control_id: number,
    description: string,

    position?: number, // Will be populated by the backend
}

export type SamplePanel = {
    sample: Sample;
    panel: Panel;

    created_at: string;
    created_by: string;
    
    visible?: boolean; // For filtering
    position?: number; // For the backend to know the position of the sample analysis in the list
    
    // Data from the backend
    device?: string;
    run_date?: string;
    run?: string;
}

// Check if value is of type Control
export function isControl(value: Object): value is Control {
    return value.hasOwnProperty("control_id");
}