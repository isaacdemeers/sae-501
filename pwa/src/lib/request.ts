import API_BASE_URL from "../../utils/apiConfig";

export async function AddUser(data: any) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (data.image) {
    formData.append("file", data.image, data.image.name);
  }

  try {
    console.log(data);
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function VerifyEmailToken(data: string) {
  let formData = {
    emailtoken: data
  }
  try {
    console.log(data);
    const response = await fetch(`${API_BASE_URL}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
}

export async function LoginUser(data: any) {
  try {
    console.log(data);
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export async function TestEmail(data: string) {
  let formData = {
    email: data
  }
  try {
    console.log(formData);
    const response = await fetch(`${API_BASE_URL}/users/testemail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error testing email:", error);
    throw error;
  }
}

export async function TestUsername(data: string) {
  let formData = {
    username: data
  }
  try {
    console.log(formData);
    const response = await fetch(`${API_BASE_URL}/users/testusername`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error testing username:", error);
    throw error;
  }
}

export async function GetGrettings() {
  try {
    const jwtToken = document.cookie.split('; ').find(row => row.startsWith('jwt_token='))?.split('=')[1] || '';
    const response = await fetch(`${API_BASE_URL}/greetings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": jwtToken
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error getting greetings:", error);
    throw error;
  }
}

export async function ResetPassword(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/reset/passwordemail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

export async function Newpass(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/reset/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function AddEvent(formData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/event/create`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
} catch (error) {
    console.error('Error creating event:', error);
}
}

export async function JoinEvent(event: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${event}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Error joining event:', error);
  }
}

export async function IsAuthentificated() {
  try {
    const response = await fetch('/api/auth/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error authenticating user:', error);
  }
}

// stocker les users qu'on invite pour event privé 
// stocker id + email + uuid pour le lien de pas connecter
// pour priver prend le lien et obliger de se connecter ou créer un compte pour voir le compte