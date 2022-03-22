import React from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import ImageIcon from '@mui/icons-material/Image';

const Inner = styled.div`
  .MuiSvgIcon-root {
    font-size: 4rem;
  }
`;

// for profile picture
class ImageUpload extends React.Component {
  state = { warningMsg: "" };

  onDrop = (accepted, rejected) => {
    if (Object.keys(rejected).length !== 0) {
      const message = "Please submit valid file type";
      this.setState({ warningMsg: message });
    } else {
      this.props.addFile(accepted);
      this.setState({ warningMsg: "" });

      var blobPromise = new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsDataURL(accepted[0]);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
      blobPromise.then(value => {
        // console.log(value);
      });
    }
  };

  render() {
    const { file, width, height, radius } = this.props;
    const thumbsContainer = {
      width,
      height,
      borderRadius: radius,
      objectFit: "cover",
      objectPosition: "center"
    };

    const thumbs = (
      <img style={thumbsContainer} src={file.preview} alt="profile" />
    );

    const render =
      Object.keys(file).length !== 0 ? (
        <aside>{thumbs}</aside>
      ) : (
        <Inner><ImageIcon /></Inner>
      );

    return (
      <div>
        <Dropzone
          style={{
            width,
            height,
            borderRadius: radius,
            objectFit: "cover",
            objectPosition: "center",
            border: " 1px dashed",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          multiple={false}
          accept="image/*"
          onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
        >
          {({ isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
            // for drag and drop warning statement
            if (isDragReject) return "Please submit a valid file";
            return render;
          }}
        </Dropzone>
      </div>
    );
  }
}

export default ImageUpload;