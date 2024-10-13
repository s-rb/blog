---
title: CV
layout: page
---

## Software engineer

Experienced and results-oriented Java developer with a passion for delivering high-quality software solutions. 
With a strong track record of delivering successful projects across various industries, including banking software and government portals

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

# This is heading 1
## This is heading 2
### This is heading 3
#### This is heading 4
##### This is heading 5
###### This is heading 6

[This is a link](#)

> This is a blockquote

`This is code`

### Bullet List
* Item 1
* Item 2
* Item 3
* Item 4

### Number List
1. Item 1
2. Item 2
3. Item 3
4. Item 4

<br>

<div class="timeline-container">
    <ul class="timeline-list">
        {% for item in site.data.work_experience.experience %}
        <li class="timeline-item">
            <div class="timeline-item-content">
                <div class="timeline-period">{{ item.period }}</div>
                <div class="timeline-position">{{ item.position }}</div>
                <a class="timeline-company-url" href="{{ site.data.work_experience.companies[item.company].url }}" target="_blank" rel="noopener noreferrer">
                    {{ site.data.work_experience.companies[item.company].name }}
                </a>
                <span class="circle"></span>
            </div>
        </li>
        {% endfor %}
        {% for item in site.data.work_experience.not_relevant_experience %}
        <li class="timeline-item">
            <div class="timeline-item-content">
                <div class="timeline-period">{{ item.period }}</div>
                <div class="timeline-position">{{ item.position }}</div>
                <a class="timeline-company-url" href="{{ site.data.work_experience.companies[item.company].url }}" target="_blank" rel="noopener noreferrer">
                    {{ site.data.work_experience.companies[item.company].name }}
                </a>
                <span class="circle"></span>
            </div>
        </li>
        {% endfor %}
    </ul>
</div>