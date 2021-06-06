import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';



const url="https://gameserver.centic.ovh/items";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {

  const peticionGet=async()=>{
    
    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5bmFtZSI6Ikp1YW5qb2ZwIiwiZ2FtZSI6Ikp1YW5qb2ZwIiwidXNlcm5hbWUiOiJKdWFuam9mcCIsImlhdCI6MTU2MTcxNjMzNH0.q4lxjs-Ztru63NHXVPhirPIUuFt849axu_PSONIiLdU");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };   
    const response = await fetch(url, requestOptions);
    const resultado = await response.json();
    setData(resultado);
  }
const styles= useStyles();
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [preguntaSeleccionada, setPreguntaSeleccionada]=useState({
    "_id": '',
    "name":'',
    //question: '',
    "image": '',
    "publish":false
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setPreguntaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(preguntaSeleccionada);
  }

 

  const peticionPost=async()=>{
    console.log("TAS AQUI");
    preguntaSeleccionada.publish=false;
    console.log(preguntaSeleccionada);
    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5bmFtZSI6Ikp1YW5qb2ZwIiwiZ2FtZSI6Ikp1YW5qb2ZwIiwidXNlcm5hbWUiOiJKdWFuam9mcCIsImlhdCI6MTU2MTcxNjMzNH0.q4lxjs-Ztru63NHXVPhirPIUuFt849axu_PSONIiLdU");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };   
    const response = await fetch(url, requestOptions);
    setData(data.concat(response.data));
    abrirCerrarModalInsertar();
  }

  const peticionPut=async()=>{
    await axios.put(url+preguntaSeleccionada._id, preguntaSeleccionada)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(pregunta=>{
        if(pregunta._id===preguntaSeleccionada._id){
          pregunta.nombre=preguntaSeleccionada.nombre;
          pregunta.enunciado=preguntaSeleccionada.enunciado;
          pregunta.imagen=preguntaSeleccionada.imagen;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

  const peticionDelete=async()=>{
    const url = "https://gameserver.centic.ovh/items/"+preguntaSeleccionada._id;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5bmFtZSI6Ikp1YW5qb2ZwIiwiZ2FtZSI6Ikp1YW5qb2ZwIiwidXNlcm5hbWUiOiJKdWFuam9mcCIsImlhdCI6MTU2MTcxNjMzNH0.q4lxjs-Ztru63NHXVPhirPIUuFt849axu_PSONIiLdU");
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
  }; 
    const response = await fetch(url, requestOptions);
    //console.log([data]);
    setData(data.filter(pregunta=>pregunta._id!==preguntaSeleccionada._id));
    abrirCerrarModalEliminar();
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const seleccionarPregunta=(pregunta, caso)=>{
    setPreguntaSeleccionada(pregunta);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(async()=>{
    await peticionGet();
  },[])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nueva Pregunta</h3>
      <TextField name="_id" className={styles.inputMaterial} label="_id" onChange={handleChange}/>
      <br />
      <TextField name="name" className={styles.inputMaterial} label="name" onChange={handleChange}/>
      <br />
      
      <TextField name="image" className={styles.inputMaterial} label="image" onChange={handleChange}/>
      <br />
      <TextField name="publish" className={styles.inputMaterial} label="publish" onChange={handleChange} />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Consola</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Nombre" onChange={handleChange} value={preguntaSeleccionada && preguntaSeleccionada.nombre}/>
      <br />
      <TextField name="empresa" className={styles.inputMaterial} label="Empresa" onChange={handleChange} value={preguntaSeleccionada && preguntaSeleccionada.empresa}/>
      <br />
      <TextField name="lanzamiento" className={styles.inputMaterial} label="Lanzamiento" onChange={handleChange} value={preguntaSeleccionada && preguntaSeleccionada.lanzamiento}/>
      <br />
      <TextField name="unidades_vendidas" className={styles.inputMaterial} label="Unidades Vendidas" onChange={handleChange} value={preguntaSeleccionada && preguntaSeleccionada.unidades_vendidas}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar la consola <b>{preguntaSeleccionada && preguntaSeleccionada._id}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )


  return (
    
    <div className="App">
      <br />
    <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <br /><br />
     <TableContainer>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>ID</TableCell>
             <TableCell>Nombre</TableCell>
             <TableCell>Enunciado</TableCell>
             <TableCell>Imagen</TableCell>
             <TableCell>Respuesta 1</TableCell>
             <TableCell>Respuesta 2</TableCell>
             <TableCell>Respuesta 3</TableCell>
             <TableCell>Respuesta 4</TableCell>
             <TableCell>Acciones</TableCell>
           </TableRow>
         </TableHead>

         <TableBody>
           {data.map(pregunta=>(
             <TableRow key={pregunta._id}>
               <TableCell>{pregunta._id}</TableCell>
               <TableCell>{pregunta.name}</TableCell>
               <TableCell>{pregunta.question}</TableCell>
               <TableCell>{pregunta.image}</TableCell>
               <TableCell>{pregunta.responses[0]}</TableCell>
               <TableCell>{pregunta.responses[1]}</TableCell>
               <TableCell>{pregunta.responses[2]}</TableCell>
               <TableCell>{pregunta.responses[3]}</TableCell>
               <TableCell></TableCell>
               <TableCell>
                 <Edit className={styles.iconos} onClick={()=>seleccionarPregunta(pregunta, 'Editar')}/>
                 &nbsp;&nbsp;&nbsp;
                 <Delete  className={styles.iconos} onClick={()=>seleccionarPregunta(pregunta, 'Eliminar')}/>
                 </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>
     
     <Modal
     open={modalInsertar}
     onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
     </Modal>

     <Modal
     open={modalEditar}
     onClose={abrirCerrarModalEditar}>
        {bodyEditar}
     </Modal>

     <Modal
     open={modalEliminar}
     onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
     </Modal>
    </div>
  );
}

export default App;