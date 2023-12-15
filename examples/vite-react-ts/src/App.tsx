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
  const [messageBtn, setMessageBtn] = useState('Intentar guardar nuevament')

  return (
    <>
      <h3>El usuario no se guardo correctamente...</h3>
      <p>Desea volver a intentar guardarlo?</p>
      <button onClick={() => deleteToast()}>Cancelar</button>
      <button
        onClick={() => {
          tryAgain()
          setMessageBtn('Guardado! 🎉')
        }}
      >
        {messageBtn}
      </button>
    </>
  )
}

export default App
