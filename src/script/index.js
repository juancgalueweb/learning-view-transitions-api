function checkIfNavigationIsSupported() {
  return Boolean(document.startViewTransition)
}

async function fetchPage(url) {
  // Cargamos la página de destino usando un fetch para obtener el HTML
  const response = await fetch(url)
  const text = await response.text()
  // Nos quedamos solo lo que está dentro de la etiqueta body
  const [_, data] = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return data
}

window.navigation.addEventListener('navigate', (event) => {
  if (!checkIfNavigationIsSupported()) return
  const toUrl = new URL(event.destination.url)

  // Es una página externa? si es así, lo ignoramos
  if (location.origin !== toUrl.origin) return

  // Si es una navegación en el mismo dominio
  event.intercept({
    async handler() {
      let data = await fetchPage(toUrl.pathname)
      // Usamos la API de view transition
      document.startViewTransition(() => {
        // Cómo actualizamos la vista
        document.body.innerHTML = data
        document.documentElement.scrollTop = 0
      })
    }
  })
})
