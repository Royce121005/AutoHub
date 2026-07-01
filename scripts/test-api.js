const BASE_URL = 'http://localhost:5000/api';

async function test() {
  console.log('--- AutoHub API Test Suite ---');
  console.log('Testing connection to server...');

  try {
    // Test base path connectivity
    const pingRes = await fetch('http://localhost:5000/');
    const pingData = await pingRes.json();
    console.log('✓ Ping server response status:', pingRes.status);
    console.log('✓ Ping response data:', pingData);

    // Test protected route authorization check
    const profileRes = await fetch(`${BASE_URL}/auth/profile`);
    const profileData = await profileRes.json();
    
    console.log('✓ Protected route status (expected 401):', profileRes.status);
    console.log('✓ Protected route response data:', profileData);
    
    if (profileRes.status === 401 && profileData.success === false) {
      console.log('\n>>> SUCCESS: API Server validation checks working correctly! <<<');
    } else {
      console.log('\n>>> FAIL: Expected unauthorized response but got something else. <<<');
    }
  } catch (error) {
    console.error('\n✗ FAILED to connect to API server. Ensure it is running using npm run dev');
    console.error('Error details:', error.message);
  }
}

test();
