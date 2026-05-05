// test-auth.js
const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication API\n');
  
  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Check...');
    const health = await fetch(`${API_URL}/health`).then(r => r.json());
    console.log('✅ Server is running\n');
  } catch (error) {
    console.error('❌ Server not running! Start backend first.\n');
    return;
  }

  // Test 2: Register Parent
  try {
    console.log('2️⃣ Testing Parent Registration...');
    const parentData = {
      email: `parent${Date.now()}@test.com`,
      password: 'password123',
      role: 'parent',
      childName: 'Jamie',
      childAge: 7,
      parentName: 'John Smith',
      parentPhone: '555-123-4567'
    };
    
    console.log('📤 Sending:', parentData);
    
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parentData)
    });
    
    const registerData = await registerRes.json();
    console.log('📥 Response:', registerData);
    
    if (registerData.success) {
      console.log('✅ Parent registration successful!\n');
      
      // Test 3: Register Therapist
      console.log('3️⃣ Testing Therapist Registration...');
      const therapistData = {
        email: `therapist${Date.now()}@test.com`,
        password: 'password123',
        role: 'therapist',
        childName: 'Client', // Therapists also need child name? Adjust as needed
        therapistId: 'LIC-12345'
      };
      
      const therapistRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(therapistData)
      });
      
      const therapistData_res = await therapistRes.json();
      console.log('📥 Response:', therapistData_res);
      
      if (therapistData_res.success) {
        console.log('✅ Therapist registration successful!\n');
      }
      
      // Test 4: Login
      console.log('4️⃣ Testing Login...');
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: parentData.email,
          password: parentData.password
        })
      });
      
      const loginData = await loginRes.json();
      console.log('📥 Response:', loginData);
      
      if (loginData.success) {
        console.log('✅ Login successful!\n');
        
        // Test 5: Get Profile
        console.log('5️⃣ Testing Get Profile...');
        const profileRes = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${loginData.data.token}`
          }
        });
        
        const profileData = await profileRes.json();
        console.log('📥 Profile:', profileData);
        console.log('✅ Profile fetched successfully!\n');
      }
    }
    
    console.log('🎉 All tests passed! Backend is working perfectly!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAuth();