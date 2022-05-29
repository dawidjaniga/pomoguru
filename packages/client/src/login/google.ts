declare global {
  const google: typeof import('google-one-tap')
}

const clientId = process.env['NX_GOOGLE_CLIENT_ID']

if (!clientId) {
  throw Error('Google Client ID not specified')
}

export function renderLoginButton (selector: string) {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = function () {
    const container = document.querySelector(selector)

    if (!(container instanceof HTMLElement)) {
      throw Error(`Google Login container for selector ${selector} not found`)
    }

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse
    })

    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large'
    })
  }
  document.head.append(script)

  async function handleCredentialResponse (
    response: google.CredentialResponse
  ) {
    // @TODO: use app
    // await useCaseProvider.get('user.loginGoogle').execute(response.credential)
  }
}
