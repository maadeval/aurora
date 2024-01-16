import { Toast, toast } from '@madeval/aurora'
import './App.css'
import { useState } from 'react'

function App() {
  return (
    <>
      <Toast />
      <button
        onClick={() => {
          toast.custom({
            isPinned: true,
            body: (t) => {
              return (
                <AlertContent
                  deleteToast={() => toast.delete(t.id)}
                  tryAgain={() =>
                    toast.update(t.id, 'success', {
                      duration: 5000,
                    })
                  }
                />
              )
            },
          })
        }}
      >
        active alert
      </button>
    </>
  )
}

const AlertContent = ({ deleteToast, tryAgain }) => {
  const [messageBtn, setMessageBtn] = useState('Volver a intentar')

  return (
    <>
      <p className='description'>
        No se han podido colocar <strong>Iphone 16</strong> en la lista de
        compras, deseas intentar otra vez?
      </p>
      <div className='button-container'>
        <button onClick={() => deleteToast()}>Cancelar</button>
        <button
          onClick={() => {
            tryAgain()
            setMessageBtn('Guardado! 🎉')
          }}
        >
          {messageBtn}
        </button>
      </div>
    </>
  )
}

export default App
