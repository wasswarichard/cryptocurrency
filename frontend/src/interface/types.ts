export interface ColumnConfig {
   id: string;
   label: string;
   minWidth?: number;
   align?: 'right';
   format?: (value: any) => string;
   styles?: (value: string) => any;
}
