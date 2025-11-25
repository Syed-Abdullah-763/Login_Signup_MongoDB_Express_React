import React, { use, useEffect, useRef, useState } from "react";
import Navbar from "../../components/navbar";
import styles from "./profile.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [imgUrl, setimgUrl] = useState("../../../assets/icon-7797704_640.png");
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}user/user`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.data.imageUrl) {
        setimgUrl(response.data.data.imageUrl);
      }

      setName(response.data.data.name);
      setEmail(response.data.data.email);
      setAge(response.data.data.age);
      setUser(response.data.data);
    } catch (error) {
      console.log(error.message);
      if (error.status == 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const updateUser = async () => {
    try {
      if (name === user.name && age === user.age) {
        return;
      }

      const payload = {};

      name !== user.name && age === user.age
        ? (payload.name = name)
        : age !== user.age && name == user.name
        ? (payload.age = age)
        : ((payload.name = name), (payload.age = age));

      const isConfirm = confirm("Are You sure you want to update something?");

      if (!isConfirm) {
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}user/user`,
        payload,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response);

      setName(response.data.data.name);
      setEmail(response.data.data.email);
      setAge(response.data.data.age);
      setUser(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const canselHandler = () => {
    setName(user.name);
    setAge(user.age);
  };

  const fileHandler = () => {
    inputRef.current.click();
  };

  const cancelHandler = () => {
    setFilePreview(null);
  };

  const imageHandler = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);

    if (imageFile) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64String = e.target.result; // This is the Base64 data URL
        setFilePreview(base64String);
      };

      reader.readAsDataURL(imageFile);
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}image/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setimgUrl(response.data.url);
      setFilePreview(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <main className={styles.wrapper}>
        <section className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>Profile</h1>
            <p className={styles.subtitle}>
              Manage your basic information and account details.
            </p>
          </header>

          {filePreview ? (
            <div className={styles.upperSection}>
              <div className={styles.avatarBlock}>
                <div className={styles.imgParent}>
                  <img src={filePreview} alt="Profile avatar" />
                </div>

                <div className={styles.uploadArea}>
                  <button className={styles.saveBtn} onClick={uploadImage}>
                    Save
                  </button>
                  <button className={styles.uploadBtn} onClick={cancelHandler}>
                    Cancel
                  </button>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={imageHandler}
                    className={styles.fileInput}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.upperSection}>
              <div className={styles.avatarBlock}>
                <div className={styles.imgParent}>
                  <img src={imgUrl} alt="Profile avatar" />
                </div>

                <div className={styles.uploadArea}>
                  <button className={styles.uploadBtn} onClick={fileHandler}>
                    Select Profile Image
                  </button>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={imageHandler}
                    className={styles.fileInput}
                  />
                  <p className={styles.uploadHint}>JPG, PNG up to 2MB.</p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.lowerSection}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  value={name}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="age" className={styles.label}>
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  onChange={(event) => {
                    setAge(event.target.value);
                  }}
                  value={age}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  className={styles.input}
                  disabled
                />
                <span className={styles.helperText}>
                  Email cannot be changed from here.
                </span>
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button className={styles.secondaryBtn} onClick={canselHandler}>
                Cancel
              </button>
              <button className={styles.primaryBtn} onClick={updateUser}>
                Update Changes
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Profile;
