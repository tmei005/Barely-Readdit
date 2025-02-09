import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import { ContentPage } from './ContentPage.js';
import { HomePage } from './HomePage.js';


function App() {
 return (
   <div className="App">
     <BrowserRouter>  {/* Wrap your routes in BrowserRouter */}
       <Routes>
         <Route path='/' element={<HomePage />} />
         <Route path='/content' element={<ContentPage />} />
       </Routes>
     </BrowserRouter>
   </div>
 );
}


export default App;