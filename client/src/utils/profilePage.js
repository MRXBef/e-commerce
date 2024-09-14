import imageCompression from "browser-image-compression";

export const handleProductImageChange = (e, setFiles) => {
  const selectedFiles = Array.from(e.target.files);

  const option = {
    maxSizeKB: 200,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };

  let compressPromises = [];

  try {
    for (const file of selectedFiles) {
      compressPromises.push(
        imageCompression(file, option).then((compressedBlob) => {
          const compressedFile = new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          return compressedFile;
        })
      );
    }

    Promise.all(compressPromises).then((compressedFiles) => {
      compressedFiles.forEach((file) => {
        setFiles((prevState) => [...prevState, file]);
        e.target.value = ''
      });
    });
  } catch (error) {
    console.error("Gagal mengkompress gambar", error);
  }
};

export const handleAvatarChange = async (e, user, axiosJWT, fetchUserData) => {
  const selectedFile = e.target.files;
  if (selectedFile.length < 1) return;

  const option = {
    maxSizeKB: 200,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };

  const compressedProfile = await imageCompression(
    selectedFile[0],
    option
  ).then((compressedBlob) => {
    const compressedFile = new File([compressedBlob], selectedFile[0].name, {
      type: selectedFile[0].type,
      lastModified: Date.now(),
    });
    return compressedFile;
  });

  const formData = new FormData();
  formData.append("image", compressedProfile);
  formData.append("userFilename", user.avatar);
  try {
    const response = await axiosJWT.post(
      `${import.meta.env.VITE_BASEURL}/user/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    fetchUserData();
  } catch (error) {
    console.error("Gagal mengupload avatar", error);
  }
};

export const categoryData = () => {
  return [
    {
      value: "elektronik",
      label: "Elektronik",
    },
    {
      value: "fashion",
      label: "Fashion",
    },
    {
      value: "kesehatan",
      label: "Kesehatan",
    },
    {
      value: "otomotif",
      label: "Otomotif",
    },
    {
      value: "bayi",
      label: "Bayi",
    },
    {
      value: "furniture",
      label: "Furniture",
    },
    {
      value: "mainan",
      label: "Mainan",
    },
    {
      value: "olahraga",
      label: "Olahraga",
    },
    {
      value: "perlengkapan-rumah",
      label: "Perlengkapan Rumah",
    },
    {
      value: "kebutuhan-harian",
      label: "Kebutuhan Harian",
    },
  ];
};
