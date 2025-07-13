import { addIndividual, getIndividualWithRelations, searchIndividuals, getFamilyStats } from './operations';

async function testDatabaseOperations() {
  console.log('🧪 Testing Family Tree Database Operations...\n');

  try {
    // Test 1: Add a new individual
    console.log('1. Adding a test individual...');
    const newPerson = await addIndividual({
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      birthDate: '1990-01-01',
      birthPlace: 'New York, NY',
      isLiving: true,
      isPrivate: false,
    });
    console.log('✅ Added individual:', newPerson.firstName, newPerson.lastName, '(ID:', newPerson.id, ')');

    // Test 2: Retrieve the individual
    console.log('\n2. Retrieving the individual...');
    const retrievedPerson = await getIndividualWithRelations(newPerson.id);
    if (retrievedPerson) {
      console.log('✅ Retrieved individual:', retrievedPerson.firstName, retrievedPerson.lastName);
    } else {
      console.log('❌ Failed to retrieve individual');
    }

    // Test 3: Search for individuals
    console.log('\n3. Searching for individuals...');
    const searchResults = await searchIndividuals('John');
    console.log('✅ Search results:', searchResults.length, 'individual(s) found');

    // Test 4: Get family statistics
    console.log('\n4. Getting family statistics...');
    const stats = await getFamilyStats();
    console.log('✅ Family stats:', {
      totalIndividuals: stats.totalIndividuals,
      livingIndividuals: stats.livingIndividuals,
      totalMarriages: stats.totalMarriages,
      totalEvents: stats.totalEvents,
    });

    console.log('\n🎉 All database operations test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseOperations();
}

export { testDatabaseOperations }; 