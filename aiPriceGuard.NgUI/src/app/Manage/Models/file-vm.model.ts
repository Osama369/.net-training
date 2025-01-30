export interface FileVM {

    FileId?: number;      // IDENTITY(1,1) => auto-increment integer
    FileName?: string;    // varchar(120)
    FileUrl?: string;     // varchar(500)
    FileType?: string;    // varchar(3) -> Typically, file type would be 3 characters (e.g., 'pdf', 'jpg')
    MimeType?: string;   // varchar(20) -> Optional field (since it is nullable in your DB schema)
    FileSize?: number;    // int -> Size in bytes (e.g., 1234567 for 1.23 MB)
    NoOfPages?: number;   // int -> Number of pages in the file (e.g., for a PDF)
    IsActive?: boolean;   // bit -> true/false
    CreatedOn?: string;   // datetime -> Store as ISO string or timestamp in Angular
    CreatedBy?: string;   // nchar(10) -> Fixed-length string (user or system ID)
    comID?: any;
    supplierName?:any;
}
