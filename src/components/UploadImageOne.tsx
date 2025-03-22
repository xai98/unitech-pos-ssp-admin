import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message } from "antd";
import { PRESIGNED_URL } from "../services";
import axios from "axios";
import { consts } from "../utils";
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import styles from "../styles/Component.module.css";
import { useLazyQuery } from "@apollo/client";


function UploadImageOne() {
  const [getPresignUrl] = useLazyQuery(PRESIGNED_URL);
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);

  const handleChange = async (event: any) => {
    setLoading(true); // Show loading indicator while uploading
    setImageName("")
    try {
      let fileData = event.target.files[0];

      let fileName = fileData.name.split(".")
      let getImageType = _.last(fileName);
      let generateFileName = uuidv4()+'.'+getImageType;

      // const fileData = info.file.name;
      if (!fileData) return message.warning('ກະລຸນາເລືອກຮູບກ່ອນ');

      const responseUrl = await getPresignUrl({
        variables: {
          name: generateFileName,
        },
      });

      let resultGetUrl = responseUrl.data.preSignedUrl.url


      await axios({
        method: "put",
        url: resultGetUrl,
        data: fileData,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        }
      });

      // Set the uploaded image URL
      setImageName(generateFileName);
      message.success("ອັບໂຫຼດຮູບສຳເລັດ");
    } catch (error) {
      message.error("ອັບໂຫຼດຮູບບໍ່ສຳເລັດ");
      console.error(error);
      setLoading(false)
    } finally {
      setLoading(false); // Stop loading after upload
    }
  };

  const uploadButton = (
    <div style={{ border: 0, background: "none", textAlign: "center" }}>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>ອັບໂຫຼດຮູບ</div>
    </div>
  );

  const UploadImage = () => {
    return (
      <>
        <input
          type="file"
          id="file-upload"
          onChange={handleChange}
          style={{ display: "none" }}
          accept="image/png, image/jpeg, image/jpg"
        />
        <label htmlFor="file-upload" className={styles.boxUploadImage} style={{padding:5}}>
          {imageName ? (
            <img
              src={consts.URL_PHOTO_AW3 + imageName}
              alt="avatar"
              style={{ width: "100%", height: "100px", objectFit: "contain" }}
            />
          ) : (
            uploadButton
          )}
        </label>
      </>
    );
  };

  return { loading, UploadImage, imageName, setImageName };
}

export default UploadImageOne;
