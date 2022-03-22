import React from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import ImageIcon from '@mui/icons-material/Image';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const Inner = styled.div`
  .MuiSvgIcon-root {
    font-size: 4rem;
  }
`;

// for profile picture
class ImageUpload extends React.Component {
  constructor() {
    super();
    this.state = {
      warningMsg: '',
    }
  }

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
      objectFit: "cover",
      objectPosition: "center",
      ...(radius ? {
        borderRadius: radius,
      } : {
        borderRadius: '10px',
      })
    };

    const thumbs = (
      <div className="relative dropzone-image">
        <img className=""
          style={thumbsContainer}
          src={file.preview} alt="profile" />
        <div className="dropzone-icon">
          <BorderColorIcon />
        </div>
      </div>
    );

    const render =
      Object.keys(file).length !== 0 ? (
        <aside style={{ width }}>{thumbs}</aside>
      ) : (
        <Inner><ImageIcon /></Inner>
      );

    return (
      <div>
        <Dropzone
          style={{
            width,
            height,
            objectFit: "cover",
            objectPosition: "center",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: "1px dashed",
            ...(radius ? {
              borderRadius: radius,
            } : {
              borderRadius: '10px',
            })
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