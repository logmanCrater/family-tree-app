import { addIndividual, addMarriage, addParentChildRelation } from './operations';

async function seedFamilyData() {
  console.log('🌱 Seeding family tree data...\n');

  try {
    // Add grandparents
    console.log('1. Adding grandparents...');
    const grandfather = await addIndividual({
      firstName: 'Robert',
      lastName: 'Smith',
      gender: 'male',
      birthDate: '1940-05-15',
      birthPlace: 'Boston, MA',
      isLiving: true,
      isPrivate: false,
    });
    console.log('✅ Added grandfather:', grandfather.firstName, grandfather.lastName);

    const grandmother = await addIndividual({
      firstName: 'Margaret',
      lastName: 'Johnson',
      gender: 'female',
      birthDate: '1942-08-22',
      birthPlace: 'Chicago, IL',
      isLiving: true,
      isPrivate: false,
    });
    console.log('✅ Added grandmother:', grandmother.firstName, grandmother.lastName);

    // Add parents
    console.log('\n2. Adding parents...');
    const father = await addIndividual({
      firstName: 'Michael',
      lastName: 'Smith',
      gender: 'male',
      birthDate: '1965-03-10',
      birthPlace: 'Boston, MA',
      isLiving: true,
      isPrivate: false,
    });
    console.log('✅ Added father:', father.firstName, father.lastName);

    const mother = await addIndividual({
      firstName: 'Sarah',
      lastName: 'Williams',
      gender: 'female',
      birthDate: '1968-11-05',
      birthPlace: 'New York, NY',
      isLiving: true,
      isPrivate: false,
    });
    console.log('✅ Added mother:', mother.firstName, mother.lastName);

    // Add children
    console.log('\n3. Adding children...');
    const child1 = await addIndividual({
      firstName: 'Emily',
      lastName: 'Smith',
      gender: 'female',
      birthDate: '1990-07-12',
      birthPlace: 'Boston, MA',
      isLiving: true,
      isPrivate: false,
    });
    console.log('✅ Added child 1:', child1.firstName, child1.lastName);

    const child2 = await addIndividual({
      firstName: 'David',
      lastName: 'Smith',
      gender: 'male',
      birthDate: '1993-02-28',
      birthPlace: 'Boston, MA',
      isLiving: true,
      isPrivate: false,
    });
    console.log('✅ Added child 2:', child2.firstName, child2.lastName);

    // Add marriages
    console.log('\n4. Adding marriages...');
    const grandparentMarriage = await addMarriage({
      spouse1Id: grandfather.id,
      spouse2Id: grandmother.id,
      marriageDate: '1960-06-20',
      marriagePlace: 'Boston, MA',
      marriageType: 'religious',
    });
    console.log('✅ Added grandparent marriage');

    const parentMarriage = await addMarriage({
      spouse1Id: father.id,
      spouse2Id: mother.id,
      marriageDate: '1988-09-15',
      marriagePlace: 'New York, NY',
      marriageType: 'civil',
    });
    console.log('✅ Added parent marriage');

    // Add parent-child relationships
    console.log('\n5. Adding parent-child relationships...');
    await addParentChildRelation({
      childId: father.id,
      parentId: grandfather.id,
      marriageId: grandparentMarriage.id,
      relationshipType: 'biological',
    });
    console.log('✅ Added father-grandfather relationship');

    await addParentChildRelation({
      childId: father.id,
      parentId: grandmother.id,
      marriageId: grandparentMarriage.id,
      relationshipType: 'biological',
    });
    console.log('✅ Added father-grandmother relationship');

    await addParentChildRelation({
      childId: child1.id,
      parentId: father.id,
      marriageId: parentMarriage.id,
      relationshipType: 'biological',
    });
    console.log('✅ Added child1-father relationship');

    await addParentChildRelation({
      childId: child1.id,
      parentId: mother.id,
      marriageId: parentMarriage.id,
      relationshipType: 'biological',
    });
    console.log('✅ Added child1-mother relationship');

    await addParentChildRelation({
      childId: child2.id,
      parentId: father.id,
      marriageId: parentMarriage.id,
      relationshipType: 'biological',
    });
    console.log('✅ Added child2-father relationship');

    await addParentChildRelation({
      childId: child2.id,
      parentId: mother.id,
      marriageId: parentMarriage.id,
      relationshipType: 'biological',
    });
    console.log('✅ Added child2-mother relationship');

    console.log('\n🎉 Family tree data seeded successfully!');
    console.log('\nFamily Structure:');
    console.log('Robert Smith (1940) + Margaret Johnson (1942)');
    console.log('  └── Michael Smith (1965) + Sarah Williams (1968)');
    console.log('      ├── Emily Smith (1990)');
    console.log('      └── David Smith (1993)');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedFamilyData();
}

export { seedFamilyData }; 