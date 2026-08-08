import "dotenv/config";
import { db } from "./index";
import {
  organizations,
  users,
  projects,
  boqItems,
  dailySiteReports,
  rfis,
} from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create sample organization
  const [org] = await db
    .insert(organizations)
    .values({
      name: "Demo Construction Company",
      slug: "demo-construction",
      planType: "free_trial",
      trialEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      subscriptionStatus: "trialing",
      maxProjects: 5,
      maxUsers: 10,
    })
    .returning();

  console.log("✅ Created organization:", org.name);

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 10);
  const [user] = await db
    .insert(users)
    .values({
      id: "user_demo_123",
      name: "Demo User",
      email: "demo@construction-hub.com",
      password: hashedPassword,
      role: "admin",
      organizationId: org.id,
    })
    .returning();

  console.log("✅ Created user:", user.email);

  // Create a sample project
  const [project] = await db
    .insert(projects)
    .values({
      name: "Dubai Marina Residential Tower",
      location: "Dubai Marina, UAE",
      clientName: "Emirates Real Estate Development",
      overallBudget: "45000000",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2025-12-31",
      projectManager: "Ahmed Al-Rashid",
      organizationId: org.id,
      createdBy: user.id,
    })
    .returning();

  console.log("✅ Created project:", project.name);

  // Create sample BOQ items
  const boqData = [
    {
      projectId: project.id,
      wbsCode: "1.1.1",
      category: "Substructure",
      description: "Excavation and earthworks for foundation",
      unit: "m³",
      contractQty: "2500",
      claimedQty: "2100",
      unitRate: "45.50",
      contractBudget: "113750",
      actualSpent: "95550",
      variance: "18200",
    },
    {
      projectId: project.id,
      wbsCode: "1.1.2",
      category: "Substructure",
      description: "Reinforced concrete foundation slab (C35/45)",
      unit: "m³",
      contractQty: "850",
      claimedQty: "850",
      unitRate: "285.00",
      contractBudget: "242250",
      actualSpent: "242250",
      variance: "0",
    },
    {
      projectId: project.id,
      wbsCode: "2.1.1",
      category: "Superstructure",
      description: "RC columns and beams - typical floor",
      unit: "m³",
      contractQty: "450",
      claimedQty: "180",
      unitRate: "320.00",
      contractBudget: "144000",
      actualSpent: "57600",
      variance: "86400",
    },
    {
      projectId: project.id,
      wbsCode: "2.2.1",
      category: "Superstructure",
      description: "Floor slab concrete pour (C30/37)",
      unit: "m³",
      contractQty: "1200",
      claimedQty: "360",
      unitRate: "275.00",
      contractBudget: "330000",
      actualSpent: "99000",
      variance: "231000",
    },
    {
      projectId: project.id,
      wbsCode: "4.1.1",
      category: "Solar/BIPV",
      description: "Rooftop solar PV panel installation",
      unit: "kWp",
      contractQty: "500",
      claimedQty: "0",
      unitRate: "1250.00",
      contractBudget: "625000",
      actualSpent: "0",
      variance: "625000",
    },
    {
      projectId: project.id,
      wbsCode: "3.1.1",
      category: "MEP Services",
      description: "Main electrical distribution system",
      unit: "set",
      contractQty: "1",
      claimedQty: "0",
      unitRate: "185000.00",
      contractBudget: "185000",
      actualSpent: "0",
      variance: "185000",
    },
  ];

  await db.insert(boqItems).values(boqData);
  console.log("✅ Created", boqData.length, "BOQ items");

  // Create sample daily report
  await db.insert(dailySiteReports).values({
    projectId: project.id,
    reportDate: "2024-02-15",
    tempMin: 18.5,
    tempMax: 32.0,
    humidity: 65.0,
    windSpeed: 12.0,
    weatherCondition: "sunny",
    totalWorkers: 45,
    workforceBreakdown: {
      steel_fixers: 12,
      carpenters: 8,
      electricians: 6,
      solar_installers: 0,
      general_labor: 19,
    },
    hseStatus: "compliant",
    zeroDaysIncident: 23,
    safetyNotes: "All workers wearing proper PPE. Scaffolding inspection completed.",
    notes: "Floor 4 slab concrete pour completed. Cylinder samples taken for 7-day strength testing. Steel fixing commenced for Floor 5 columns.",
    createdBy: "Hassan Al-Tamimi - Site Engineer",
  });

  console.log("✅ Created sample daily report");

  // Create sample RFIs
  const rfiData = [
    {
      projectId: project.id,
      rfiNumber: "RFI-2024-001",
      subject: "Foundation reinforcement bar spacing clarification",
      description: "Drawing Rev C shows 200mm spacing but detail D3 shows 150mm. Please confirm correct spacing for grid lines A-D.",
      priority: "high",
      assignedTo: "Structural Consultant - ABC Engineering",
      status: "in-review",
      targetDate: "2024-02-20",
      createdBy: "Site Engineer",
    },
    {
      projectId: project.id,
      rfiNumber: "RFI-2024-002",
      subject: "BIPV solar panel mounting details",
      description: "Request structural mounting detail for rooftop solar array connection to RC roof slab.",
      priority: "medium",
      assignedTo: "Solar Consultant",
      status: "open",
      targetDate: "2024-02-25",
      createdBy: "MEP Coordinator",
    },
    {
      projectId: project.id,
      rfiNumber: "RFI-2024-003",
      subject: "Fire-rated sealant specification",
      description: "Specification calls for 2-hour fire rating but product datasheet shows 90-minute rating. Require alternative product approval.",
      priority: "medium",
      assignedTo: "Fire Safety Consultant",
      status: "closed",
      targetDate: "2024-02-10",
      closedDate: "2024-02-12",
      response: "Approved alternative product: Hilti FS-ONE MAX with 2-hour fire rating certificate.",
      createdBy: "QA/QC Engineer",
    },
  ];

  await db.insert(rfis).values(rfiData);
  console.log("✅ Created", rfiData.length, "RFIs");

  console.log("🎉 Database seeding completed!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
