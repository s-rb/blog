---
title: CV
layout: page
---

## Software engineer

Experienced and results-oriented Java developer with a passion for delivering high-quality software solutions.
With a strong track record of delivering successful projects across various industries, including banking software and
government portals

Throughout my career, I have demonstrated a passion for software development and a commitment to continuous learning
and growth. I have successfully collaborated with cross-functional teams to streamline the software development process
and enhance code quality. Skilled in team leadership, I have effectively managed and mentored junior developers,
fostering a collaborative and productive work environment.

After spending 10 years working in the designing of engineering systems, leading design teams, and managing project
implementation following my graduation in 2009, my strong desire to pursue a career in software development led me
to become a Java developer.

I am driven by the challenge of solving complex problems and thrive in dynamic environments where I can apply my
strong problem-solving skills and attention to detail. With a focus on delivering exceptional results, I am dedicated
to surpassing customer expectations and driving business success.

I am seeking a new opportunity where I can leverage my experience to contribute to the success of a promising company.

---

<h3>
Working timeline
</h3>

<div class="timeline">
    <div class="timeline-container">
        <ul class="timeline-list">
            {% for item in site.data.work_experience.experience %}
            <li class="timeline-item">
                <div class="timeline-item-content">
                    <div class="timeline-position has-text-white">{{ item.position }}</div>
                    <div class="timeline-period has-text-white">{{ item.period }}</div>
                    <a class="timeline-company-url has-text-white" href="{{ site.data.work_experience.companies[item.company].url }}" target="_blank" rel="noopener noreferrer">
                        {{ site.data.work_experience.companies[item.company].name }}
                    </a>
                    <span class="circle"></span>
                </div>
            </li>
            {% endfor %}
            <div></div>
            <div class="engineering-experience-msg">
                <div><hr class="timeline-hr"/></div>
                <div>Other experience</div>
                <div class="container timeline-toggle-button has-text-centered has-background-grey-darker has-text-white">SHOW DETAILS</div>
                <div><hr class="timeline-hr"/></div>
            </div>
            {% for item in site.data.work_experience.engineering_experience %}
            <li class="timeline-item not-relevant-sum">
                <div class="timeline-item-content">
                    <div class="timeline-position has-text-white">{{ item.position }}</div>
                    <div class="timeline-period has-text-white">{{ item.period }}</div>
                    <a class="timeline-company-url has-text-white" href="/" target="_blank" rel="noopener noreferrer">
                        {{ item.company }}
                    </a>
                    <span class="circle"></span>
                </div>
            </li>
            {% endfor %}
            <div></div>
            {% for item in site.data.work_experience.not_relevant_experience %}
            <li class="timeline-item not-relevant">
                <div class="timeline-item-content">
                    <div class="timeline-position has-text-white">{{ item.position }}</div>
                    <div class="timeline-period has-text-white">{{ item.period }}</div>
                    <a class="timeline-company-url has-text-white" href="{{ site.data.work_experience.companies[item.company].url }}" target="_blank" rel="noopener noreferrer">
                        {{ site.data.work_experience.companies[item.company].name }}
                    </a>
                    <span class="circle"></span>
                </div>
            </li>
            {% endfor %}
        </ul>
    </div>
</div>

<script src="{{site.url}}{{site.baseurl}}/assets/js/toggle-timeline.js"></script>