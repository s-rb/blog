---
title: CV
layout: page
---

<h1>
{{site.data.work_experience.job-title}}
</h1>

{% for item in site.data.work_experience.description %}
<p class="cv-description">{{item}}</p>
{% endfor %}

---

<h2>
Core competencies
</h2>

<ul class="cv-core-competencies is-marginless">
{% for item in site.data.work_experience.core-competencies %}
    <li>{{item}}</li>
{% endfor %}
</ul>

---

<h2>
Professional experience
</h2>

{% for item in site.data.work_experience.experience %}
<div class="cv-experience-header">
    <div class="cv-position">{{item.position}}</div>
    <div class="cv-experience-period">{{ item.period.started }}{% if item.period.finished %} - {{item.period.finished}}{% else %} - now{% endif %}</div>
</div>
<div class="cv-experience-header">
    <div class="cv-company">
{% if site.data.work_experience.companies[item.company] %}
{{site.data.work_experience.companies[item.company].name}}
{% else %}
{{item.company}}
{% endif %}</div>
    <div class="cv-experience-period-diff">
        {% if item.period.started %}
            {% assign current_month = "now" | date: "%m" | plus: 0 %}
            {% assign current_year = "now" | date: "%Y" | plus: 0 %}
            {% assign date1 = item.period.started | split: '.' %}
            {% assign date2 = item.period.finished | default: current_month | append: "." | append: current_year | split: '.' %}
            {% assign month1 = date1[0] | plus: 0 %}
            {% assign year1 = date1[1] | plus: 0 %}
            {% assign month2 = date2[0] | plus: 0 %}
            {% assign year2 = date2[1] | plus: 0 %}
            {% assign year_diff = year2 | minus: year1 %}
            {% assign month_diff = month2 | minus: month1 %}
            {% if month_diff < 0 %}
                {% assign month_diff = month_diff | plus: 12 %}
                {% assign year_diff = year_diff | minus: 1 %}
            {% endif %}
            {% if year_diff > 0 %}
                {{year_diff}}y
            {% endif %}
            {% if month_diff > 0 %}
                {{month_diff}}m
            {% endif %}
        {% endif %}
    </div>
</div>
{% for paragraph in item.description %}
<p class="cv-description">- {{paragraph}}</p>
{% endfor %}
{% endfor %}

{% if site.data.work_experience.engineering_experience %}
<h2>Engineering professional experience</h2>
{% for item in site.data.work_experience.engineering_experience %}
<div class="cv-experience-header">
    <div class="cv-position">{{item.position}}</div>
    <div class="cv-experience-period">{{ item.period.started }}{% if item.period.finished %} - {{item.period.finished}}{% else %} - now{% endif %}</div>
</div>
<div class="cv-experience-header">
    <div class="cv-company">
{% if site.data.work_experience.companies[item.company] %}
{{site.data.work_experience.companies[item.company].name}}
{% else %}
{{item.company}}
{% endif %}</div>
    <div class="cv-experience-period-diff">
        {% if item.period.started %}
            {% assign current_month = "now" | date: "%m" | plus: 0 %}
            {% assign current_year = "now" | date: "%Y" | plus: 0 %}
            {% assign date1 = item.period.started | split: '.' %}
            {% assign date2 = item.period.finished | default: current_month | append: "." | append: current_year | split: '.' %}
            {% assign month1 = date1[0] | plus: 0 %}
            {% assign year1 = date1[1] | plus: 0 %}
            {% assign month2 = date2[0] | plus: 0 %}
            {% assign year2 = date2[1] | plus: 0 %}
            {% assign year_diff = year2 | minus: year1 %}
            {% assign month_diff = month2 | minus: month1 %}
            {% if month_diff < 0 %}
                {% assign month_diff = month_diff | plus: 12 %}
                {% assign year_diff = year_diff | minus: 1 %}
            {% endif %}
            {% if year_diff > 0 %}
                {{year_diff}}y
            {% endif %}
            {% if month_diff > 0 %}
                {{month_diff}}m
            {% endif %}
        {% endif %}
    </div>
</div>
{% for paragraph in item.description %}
<p class="cv-description">- {{paragraph}}</p>
{% endfor %}
{% endfor %}
{% endif %}
<h2>Education</h2>
{% for item in site.data.work_experience.education %}
<div>
    <div class="cv-education-header">
        <div class="cv-company">{{item.company}}</div>
        <div class="cv-experience-period-diff">{{item.period}}</div>
    </div>
    <div class="cv-education-header">
        <div class="cv-description">
            <div>{{item.additional}}</div>
            <div>{{item.qualification}}</div>
        </div>
        <div class="cv-experience-period">{{item.date_start}} - {{item.date_end}}</div>
    </div>
</div>
{% endfor %}

<h2>Certifications</h2>
{% for item in site.data.work_experience.certifications %}
<div class="cv-summary">
    <strong>{{item.company}}, </strong>
    <span>{{item.name}}, </span>
    <span>{{item.date}}</span>
</div>
{% endfor %}