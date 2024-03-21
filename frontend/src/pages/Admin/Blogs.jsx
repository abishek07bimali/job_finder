// import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import the styles
// import AdminLayout from '../../components/AdminLayout';

// const Blogs = () => {
//   const [content, setContent] = useState('');

//   const modules = {
//     toolbar: [
//       [{ 'header': [1, 2, false] }],
//       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//       [{ 'size': ['small', false, 'large', 'huge'] }],
//       [{ 'font': [] }],
//       [{'color': []}, {'background': []}],
//       [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
//       ['align'],
//       ['link', 'image', 'video'],
//       ['code-block'],
//       ['clean'],
//       ['table'],
//     ],
//     clipboard: {
//       matchVisual: false,
//     },
//   };

//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike', 'blockquote',
//     'list', 'bullet', 'indent', 'align',
//     'link', 'image', 'video', 'color', 'background',
//     'code-block',
//     'table',
//   ];

//   const handleChange = (value) => {
//     setContent(value);
//   };

//   return (
//     <div>
//       <ReactQuill
//         value={content}
//         onChange={handleChange}
//         modules={modules}
//         formats={formats}
//       />
//       <button onClick={() => console.log(content)}>Submit</button>
//     </div>
//   );
// };

// export default Blogs;
