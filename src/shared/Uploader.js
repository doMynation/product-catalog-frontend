import React from 'react';
import PropTypes from 'prop-types';
import {FilePond, File, registerPlugin} from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import {API_URL} from "../conf";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const i18n = {
  idle: `Glissez-déposez une image ici ou appuyez <span class="filepond--label-action">ici pour parcourir</span>`,
  loading: "Chargement",
  uploading: "Téléchargement",
  cancelButton: "Annuler",
  cancelHelp: "Appuyez pour annuler",
  removeButton: "Retirer",
  invalidFileType: "Type de fichier invalide",
};

const serverConfig = {
  url: API_URL,
  // process: '/admin/upload',
  process: {
    url: '/admin/upload',
    withCredentials: true,
    timeout: 7000,
  },
  revert: null,
  restore: null,
  load: '/uploads/',
};

class Uploader extends React.PureComponent {
  handleUpload = (error, file) => {
    const newFiles = this.props.files.concat([file.serverId]);

    this.props.onFilesChanged(newFiles);
  }

  handleRemove = file => {
    // @hack: This fixes a bug with the `onremovefile` callback being called for no obvious reasons after a successful upload
    const realFiles = this.pond.getFiles().map(f => f.serverId);

    this.props.onFilesChanged(realFiles);
  }

  render() {
    const {files, maxFiles = 1, acceptedFileTypes = []} = this.props;
    const doValidateFileType = acceptedFileTypes.length !== 0;

    return (
      <div>
        <FilePond ref={ref => this.pond = ref}
          acceptedFileTypes={acceptedFileTypes}
          allowMultiple={true}
          maxFiles={maxFiles}
          server={serverConfig}
          onremovefile={this.handleRemove}
          onprocessfile={this.handleUpload}
          labelIdle={i18n.idle}
          labelTapToCancel={i18n.cancelHelp}
          labelButtonAbortItemProcessing={i18n.cancelButton}
          labelFileProcessing={i18n.uploading}
          labelButtonRemoveItem={i18n.removeButton}
          labelFileTypeNotAllowed={i18n.invalidFileType}
          allowFileTypeValidation={doValidateFileType}
        >
          {files.map(file => (
            <File key={file} src={file} origin="local"/>
          ))}
        </FilePond>
      </div>
    );
  }
}

Uploader.propTypes = {
  files: PropTypes.arrayOf(PropTypes.string),
  onFilesChanged: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
};

export default Uploader;
