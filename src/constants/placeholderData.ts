import type { ProfileData } from '../types/profile';

export const STATIC_PLACEHOLDER_DATA: ProfileData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 000-0000",
  linkedin: "linkedin.com/in/johndoe",
  github: "github.com/johndoe",
  summary: "Senior Software Engineer with 5+ years of experience specializing in React, TypeScript, and Node.js. Proven track record of developing scalable high-performance web applications and mentoring development teams at Tech Corp and Innovate Solutions.",
  workExperience: [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Tech Corp",
      dateStr: "Jan 2020 - Present",
      description: "- Engineered cloud-native React applications serving over 1M monthly users.\n- Improved overall system performance by 40% through strategic bottleneck remediation.\n- Mentored a cross-functional team of 15 developers in agile best practices."
    },
    {
      id: "2",
      title: "Full-Stack Developer",
      company: "Innovate Solutions",
      dateStr: "Jun 2017 - Dec 2019",
      description: "- Delivered modular TypeScript architectures for SaaS enterprise clients.\n- Integrated Python-based data pipelines to optimize reporting microservices.\n- Authored automated test suites reducing production bug frequency by 25%."
    }
  ],
  projects: "- **CloudScale**: A Go-powered infrastructure-as-code automation platform.\n- **ReactiveFlow**: State management library for large-scale TypeScript applications.",
  education: [
    {
      id: "edu1",
      degree: "B.Tech in Computer Science",
      school: "Global University",
      year: "2013 - 2017"
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Python", "Cloud Computing", "AWS", "Docker", "Kubernetes", "GraphQL", "PostgreSQL"],
  achievements: "- Keynote Speaker at Global DevConference 2022\n- Featured contributor to React core documentation and community libraries"
};
