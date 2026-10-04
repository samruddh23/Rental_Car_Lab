/**
 * Automated Full-Stack API Test Suite (Experiment 10)
 * Tests core REST endpoints, MongoDB CRUD, JWT Auth, and Payments.
 * Run directly via: node tests/api.test.js
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000/api';

const results = [];

const assert = (condition, testName) => {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    results.push({ name: testName, status: 'PASS' });
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    results.push({ name: testName, status: 'FAIL' });
  }
};

export const runAutomatedTests = async () => {
  console.log(`\n======================================================`);
  console.log(` 🧪 Starting Automated Full-Stack API Tests (Exp 10) `);
  console.log(` Target Server: ${BASE_URL}`);
  console.log(`======================================================\n`);

  try {
    // 1. Health & Database Check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'online', '1. System Health & Database Online Check');

    // 2. GET All Cars
    const carsRes = await fetch(`${BASE_URL}/cars`);
    const carsData = await carsRes.json();
    assert(carsRes.status === 200 && Array.isArray(carsData.data) && carsData.data.length > 0, '2. Retrieve Vehicle Fleet from MongoDB');

    // 3. GET Filtered Cars
    const suvRes = await fetch(`${BASE_URL}/cars?category=suv`);
    const suvData = await suvRes.json();
    const allAreSuvs = suvData.data.every(c => c.category.toLowerCase() === 'suv');
    assert(suvRes.status === 200 && allAreSuvs, '3. Query Filter by Category (SUV)');

    // 4. POST Create Vehicle (CRUD Create)
    const testCarPayload = {
      make: 'Mahindra',
      model: 'Scorpio-N Z8L 4x4',
      type: 'All-Terrain Luxury SUV',
      category: 'suv',
      price: 2899,
      transmission: 'Automatic 4XPLOR',
      passengers: 7,
      fuel: 'mHawk 2.2L Diesel',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'
    };
    const createCarRes = await fetch(`${BASE_URL}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCarPayload)
    });
    const createCarData = await createCarRes.json();
    const createdCarId = createCarData.data?.id;
    assert(createCarRes.status === 201 && createdCarId, '4. Create Vehicle in MongoDB (CRUD Create)');

    // 5. PUT Update Vehicle (CRUD Update)
    if (createdCarId) {
      const updateCarRes = await fetch(`${BASE_URL}/cars/${createdCarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 3099, available: false })
      });
      const updateCarData = await updateCarRes.json();
      assert(updateCarRes.status === 200 && updateCarData.data.price === 3099, '5. Update Vehicle Rate & Availability (CRUD Update)');

      // 6. DELETE Vehicle (CRUD Delete)
      const deleteCarRes = await fetch(`${BASE_URL}/cars/${createdCarId}`, {
        method: 'DELETE'
      });
      assert(deleteCarRes.status === 200, '6. Delete Vehicle from MongoDB (CRUD Delete)');
    }

    // 7. JWT Signup & Bcrypt Encryption (Exp 7)
    const testEmail = `test.user.${Date.now()}@apexdrive.in`;
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Automation User',
        email: testEmail,
        password: 'securePassword123'
      })
    });
    const signupData = await signupRes.json();
    const jwtToken = signupData.token;
    assert(signupRes.status === 201 && jwtToken, '7. User Registration & JWT Token Issuance (Exp 7)');

    // 8. Protected Route Guard (Exp 7)
    if (jwtToken) {
      const protectedRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      const protectedData = await protectedRes.json();
      assert(protectedRes.status === 200 && protectedData.user?.email === testEmail, '8. JWT Bearer Token Verification on Protected Route');
    }

    // 9. Payment Order Creation & Verification (Exp 8)
    const orderRes = await fetch(`${BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 8500,
        bookingId: 'BK-TEST-123'
      })
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201 && orderData.order?.id, '9. Razorpay / UPI Order Generation (Exp 8)');

    // 10. Real-Time WebSocket Endpoint (Exp 9)
    const realtimeRes = await fetch(`${BASE_URL}/realtime/status`);
    const realtimeData = await realtimeRes.json();
    assert(realtimeRes.status === 200 && realtimeData.status === 'ACTIVE', '10. WebSocket / Socket.io Engine Health (Exp 9)');

    console.log(`\n======================================================`);
    const passCount = results.filter(r => r.status === 'PASS').length;
    console.log(` 🏁 Test Suite Completed: ${passCount}/${results.length} PASSED`);
    console.log(`======================================================\n`);

    return {
      total: results.length,
      passed: passCount,
      failed: results.length - passCount,
      results
    };
  } catch (error) {
    console.error('Test execution failed:', error.message);
    return {
      total: results.length,
      passed: results.filter(r => r.status === 'PASS').length,
      failed: 1,
      error: error.message,
      results
    };
  }
};

// Run if called directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runAutomatedTests().then(summary => {
    process.exit(summary.failed > 0 ? 1 : 0);
  });
}
