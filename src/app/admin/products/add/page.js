





// "use client";
// import { useState } from "react";

// export default function AddProduct() {
//   const [product, setProduct] = useState({
//     name: "",
//     price: "",
//     description: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "image") {
//       setProduct({ ...product, image: files[0] });
//     } else {
//       setProduct({ ...product, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", product.name);
//     formData.append("price", product.price);
//     formData.append("description", product.description);

//     if (product.image) {
//       formData.append("image", product.image);
//     }

//     const res = await fetch("/api/products", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Product Added Successfully!");
//       setProduct({ name: "", price: "", description: "", image: null });
//     } else {
//       alert("Upload failed: " + (data.error || "Unknown error"));
//     }
//   };

//   return (
//     <div style={{ marginLeft: "80px", padding: "30px", marginTop: "-10px", background: "#eef0f4ff", }}>
//       <h1>Admin - Manage Products</h1>

//       <div
//         style={{
//           background: "#eef0f4ff",
//           padding: "30px",
//           borderRadius: "15px",
//           maxWidth: "400px",
//           marginTop: "20px",
//         }}
//       >
//         <h2>Add Product</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Product Name"
//             value={product.name}
//             onChange={handleChange}
//             required
//             style={inputStyle}
//           />

//           <input
//             type="number"
//             name="price"
//             placeholder="Price"
//             value={product.price}
//             onChange={handleChange}
//             required
//             style={inputStyle}
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={product.description}
//             onChange={handleChange}
//             required
//             style={{ ...inputStyle, height: "120px" }}
//           />

//           {/* SINGLE FILE INPUT */}
//           <input
//             type="file"
//             name="image"
//             onChange={handleChange}
//             required
//             className="custom-file-input"
//             style={{ marginTop: "10px", marginBottom: "25px", color: "black" }}
//           />

//           <button type="submit" style={buttonStyle}>
//             Add Product
//           </button>
//         </form>
//       </div>

//       {/* CSS remove "No file chosen" */}
//       <style jsx>{`
//         .custom-file-input {
//           color: transparent;
//         }

//         .custom-file-input::-webkit-file-upload-button {
//           visibility: visible;
//         }

//         .custom-file-input::file-selector-button {
//           visibility: visible;
//         }
//       `}</style>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "12px",
//   marginBottom: "15px",
//   borderRadius: "8px",
//   border: "1px solid #ccc",
//   fontSize: "16px",
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   backgroundColor: "#28a745",
//   color: "white",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "16px",
//   cursor: "pointer",
// };




"use client";

import { useState, useRef } from "react";

export default function AdminProductForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setGalleryFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (galleryFiles.length === 0) {
      alert("Please select at least one image ❌");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Product added successfully ✅");
        resetForm();
        onSuccess?.();
      } else {
        alert(data.error || "Upload failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrongss ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "40px",
        background: " #eef0f4ee",
        padding: "25px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        maxWidth: "500px",
        marginLeft: "80px",
        marginTop: "-8px"
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Add Product</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        style={inputStyle}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...inputStyle, minHeight: "80px" }}
      />

      {/* Image upload */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "600" }}>Images</label>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
          {galleryFiles.map((file, idx) => (
            <div key={idx} style={fileBox}>
              {file.name.substring(0, 10)}...
              <button type="button" onClick={() => removeFile(idx)} style={removeBtn}>✕</button>
            </div>
          ))}

          <div
            onClick={() => fileInputRef.current?.click()}
            style={addBox}
          >
            +
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <button type="submit" style={buttonStyle}>
        Save Product
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const fileBox = {
  position: "relative",
  background: "#e9ecef",
  width: "60px",
  height: "60px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
  textAlign: "center",
  border: "1px dashed #adb5bd",
};

const removeBtn = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "#6c757d",
  color: "white",
  borderRadius: "50%",
  border: "none",
  width: "18px",
  height: "18px",
  fontSize: "10px",
  cursor: "pointer",
};

const addBox = {
  width: "60px",
  height: "60px",
  border: "2px dashed #007bff",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#007bff",
  fontSize: "20px",
};

const buttonStyle = {
  background: "#28a745",
  color: "#fff",
  padding: "12px 25px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};
