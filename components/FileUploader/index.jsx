import { useRef, useState } from 'react';
import styles from './style.module.scss';

import { FileUpload } from 'primereact/fileupload';

const FileUploader = ({

}) => {
    const fileUploadRef = useRef(null);

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
            </div>
        );
    }

    return (
        <FileUpload
            ref={fileUploadRef}
            className={styles.file_uploader}
            headerClassName={styles.file_uploader_header}
            headerTemplate={headerTemplate}
            chooseOptions={chooseOptions}
            cancelOptions={cancelOptions}
            uploadOptions={uploadOptions}
        />
    )
}

export { FileUploader };