"use client";

import React from "react";

function PrivacyPolicy() {
    return (
      <div className="container mx-auto pb-8 px-4 text-foreground rounded-lg overflow-auto">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-foreground dark:text-foreground">Privacy Policy</h1>
  
        {/* Effective Date */}
        <p className="text-muted mb-8 dark:text-muted">Effective Date: 10.02.2024</p>
  
        {/* Intro section */}
        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
            Introduction
          </h2>
          <p className="text-muted dark:text-muted">
            This Privacy Policy describes how BookWizard ("we", "us", or "our")
            collects, uses, and discloses your personal information when you use
            our website and services (the "Services").
          </p>
        </section>
  
        {/* Data collection section */}
        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
            Information We Collect
          </h2>
          <ul className="list-disc text-muted dark:text-muted pl-5">
            <li>Account Information: email</li>
            <li>Book Information: title, description, rating, image etc.</li>
          </ul>
        </section>
  
        {/* Data usage section */}
        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
            How We Use Your Information
          </h2>
          <ul className="list-disc text-muted dark:text-muted pl-5">
            <li>To provide and operate the Services.</li>
            <li>To personalize your experience and recommendations.</li>
            <li>To communicate with you about the Services.</li>
            <li>To analyze and improve the Services.</li>
            <li>To comply with legal and regulatory requirements.</li>
          </ul>
        </section>
  
        {/* Data sharing section */}
        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
            Sharing Your Information
          </h2>
          <p className="text-muted dark:text-muted">
            We do not share any of your information with anyone.
          </p>
        </section>
  
        {/* Contact section */}
        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">Contact Us</h2>
          <p className="text-muted dark:text-muted">
            If you have any questions about this Privacy Policy, please contact us
            at:
          </p>
          <a
            href="mailto:bookwormapp2@gmail.com"
            className="text-sky-600 underline dark:text-accent"
          >
            bookwormapp2@gmail.com
          </a>
        </section>
      </div>
    );
  }
  
  export default PrivacyPolicy;