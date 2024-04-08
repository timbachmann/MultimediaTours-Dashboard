import {styled} from "@mui/system";
import React, {useState} from "react";

const FileUploadInput = styled('input')(() => ({
    minWidth: '20rem',
    margin: '0',
    opacity: '0'
}))

const FileUploadLabel = styled('label')(() => ({
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    height: '2.5rem'
}))

const FileUploadSpan = styled('span')(() => ({
    position: 'absolute',
    top: '0',
    right: '0',
    left: '0',
    zIndex: '5',
    height: '2.5rem',
    padding: '0.5rem 1rem',
    lineHeight: '1.5',
    color: '#555',
    backgroundColor: '#fff',
    border: '0.075rem solid #ddd',
    borderRadius: '0.25rem',
    boxShadow: 'inset 0 0.2rem 0.4rem rgba(0,0,0,.05)'
}))

const FileUploadSpanBefore = styled('span')(() => ({
    position: 'absolute',
    top: '-0.0rem',
    right: '-0.075rem',
    bottom: '-0.075rem',
    zIndex: '6',
    display: 'block',
    content: '"Browse"',
    height: '2.5rem',
    padding: '0.5rem 1rem',
    lineHeight: '1.5',
    color: '#555',
    backgroundColor: '#eee',
    border: '0.075rem solid #ddd',
    borderRadius: '0 0.25rem 0.25rem 0'
}))

const FileUploadSpanAfter = styled('span')(() => ({
    content: '"Upload file..."'
}))

const FileInput = (props) => {

    const [fileCount, setFileCount] = useState('Upload File...')

    const handleFileInputChange = (event) => {
        setFileCount(event.target.files.length + (event.target.files.length > 1 ? " files" : " file") + " selected")
        props.onChange(event)
    }

    return (
        <div>
        <FileUploadLabel>
            <FileUploadInput
                type='file'
                name='file'
                disabled={props.disabled}
                multiple={props.multiple}
                onChange={handleFileInputChange}
            />
            <FileUploadSpanBefore>{'Browse'}</FileUploadSpanBefore>
            <FileUploadSpan>{fileCount}</FileUploadSpan>
            <FileUploadSpanAfter/>
        </FileUploadLabel>
        </div>
    )
}

export default FileInput