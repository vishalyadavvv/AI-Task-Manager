require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({ email: 'demo@taskflow.com' });
    console.log('🗑️ Cleared existing demo user (if any)');

    // Create demo user (password hashing is handled by model hook)
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@taskflow.com',
      password: 'demo1234'
    });
    console.log('👤 Demo user created');

    // Clear existing tasks for this user
    await Task.deleteMany({ user: demoUser._id });

    // Create demo tasks
    const tasks = [
      {
        user: demoUser._id,
        title: 'Welcome to TaskFlow ✦',
        description: 'This is your first task. Explore the AI-powered features!',
        status: 'Pending',
        category: 'Work',
        priority: 'High',
        aiSource: 'ai',
        aiReasoning: 'Initial welcome task.'
      },
      {
        user: demoUser._id,
        title: 'Review Project Guidelines',
        description: 'Check the README for setup instructions.',
        status: 'Pending',
        category: 'Study',
        priority: 'Medium',
        aiSource: 'user'
      },
      {
        user: demoUser._id,
        title: 'Weekly Team Sync',
        description: 'Discussion on upcoming milestones.',
        status: 'Completed',
        category: 'Work',
        priority: 'Medium',
        aiSource: 'ai',
        aiReasoning: 'Detected professional meeting context.'
      },
      {
        user: demoUser._id,
        title: 'Gym Session',
        description: 'Focus on cardio and strength.',
        status: 'Pending',
        category: 'Health',
        priority: 'Low',
        aiSource: 'ai',
        aiReasoning: 'Health and fitness keywords detected.'
      }
    ];

    await Task.insertMany(tasks);
    console.log(`📝 Created ${tasks.length} demo tasks`);

    console.log('\n✨ Seeding successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
