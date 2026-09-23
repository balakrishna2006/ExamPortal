package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // Portal Key Metrics / Statistics
        model.addAttribute("stats", Map.of(
            "activeExams", "18",
            "studentsTested", "145,280+",
            "institutions", "120+",
            "proctorAccuracy", "99.94%"
        ));

        // Live & Upcoming Examination Schedule
        List<ExamSchedule> exams = Arrays.asList(
            new ExamSchedule(
                "CS-401",
                "Advanced Computer Networks & Security",
                "Computer Science",
                "Today, 10:00 AM - 11:30 AM",
                "90 Mins",
                60,
                "LIVE",
                "Full AI Proctoring",
                "LIVE-NET401"
            ),
            new ExamSchedule(
                "DS-302",
                "Design & Analysis of Algorithms",
                "Information Technology",
                "Today, 02:00 PM - 03:30 PM",
                "90 Mins",
                45,
                "UPCOMING",
                "Browser Lockdown + Cam",
                "ALGO-302"
            ),
            new ExamSchedule(
                "AI-505",
                "Deep Learning & Neural Architectures",
                "Artificial Intelligence",
                "Today, 04:30 PM - 06:00 PM",
                "90 Mins",
                50,
                "UPCOMING",
                "AI Proctoring + Audio",
                "DL-505"
            ),
            new ExamSchedule(
                "MCQ-101",
                "General Aptitude & Reasoning Mock Test",
                "Common Assessment",
                "Always Open (24x7)",
                "45 Mins",
                30,
                "MOCK",
                "Self Practice Mode",
                "MOCK-APT1"
            ),
            new ExamSchedule(
                "EE-204",
                "Digital Signal Processing Mid-Term",
                "Electrical Engineering",
                "Tomorrow, 09:30 AM - 11:00 AM",
                "90 Mins",
                40,
                "UPCOMING",
                "Dual Camera Monitoring",
                "DSP-204"
            ),
            new ExamSchedule(
                "PY-108",
                "Python Programming Benchmark Mock",
                "Computer Science",
                "Always Open (24x7)",
                "60 Mins",
                35,
                "MOCK",
                "Self Practice Mode",
                "MOCK-PY08"
            )
        );
        model.addAttribute("exams", exams);

        // System Announcements & Notices
        List<String> notices = Arrays.asList(
            "Semester-End Examination Hall Tickets (Dec 2026 / Jan 2027) are now ready for download.",
            "Mandatory System Diagnostic Check must be completed 30 minutes prior to exam launch.",
            "Webcam & microphone permissions are required for all AI-Proctored sessions.",
            "24/7 Candidate Technical Helpdesk is active during live testing hours."
        );
        model.addAttribute("notices", notices);

        return "index";
    }

    // Static nested class representing exam items
    public static class ExamSchedule {
        private String code;
        private String title;
        private String department;
        private String scheduleTime;
        private String duration;
        private int totalQuestions;
        private String status; // LIVE, UPCOMING, MOCK
        private String proctorType;
        private String sampleAccessKey;

        public ExamSchedule(String code, String title, String department, String scheduleTime,
                            String duration, int totalQuestions, String status,
                            String proctorType, String sampleAccessKey) {
            this.code = code;
            this.title = title;
            this.department = department;
            this.scheduleTime = scheduleTime;
            this.duration = duration;
            this.totalQuestions = totalQuestions;
            this.status = status;
            this.proctorType = proctorType;
            this.sampleAccessKey = sampleAccessKey;
        }

        public String getCode() { return code; }
        public String getTitle() { return title; }
        public String getDepartment() { return department; }
        public String getScheduleTime() { return scheduleTime; }
        public String getDuration() { return duration; }
        public int getTotalQuestions() { return totalQuestions; }
        public String getStatus() { return status; }
        public String getProctorType() { return proctorType; }
        public String getSampleAccessKey() { return sampleAccessKey; }
    }
}
