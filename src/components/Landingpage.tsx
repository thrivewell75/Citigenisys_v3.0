import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Play,
  Shield,
  Target,
  Database,
  MapPin,
  TrendingUp,
  FileCheck,
  Zap,
  BarChart,
  CheckCircle,
} from "lucide-react";

interface LandingPageProps {
  onLaunchTool: () => void;
  onRequestDemo: () => void;
}

export function LandingPage({ onLaunchTool, onRequestDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight">
                From Input to Impact—Urban Intelligence
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Eliminate weeks of modeling and deliver standardized, validated
                metrics for all stakeholders—instantly.
              </p>
            </div>

            {/* Credibility Badge */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">
                Powered by Industry Standard Parameters
              </span>
            </div>

            {/* Demo Video Placeholder */}
            <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Play className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        See the Calculation Engine in Action
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        [EMBED DEMO VIDEO: See the calculation engine in action
                        – Draw, Parameterize, and Calculate in 60 seconds.]
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={onLaunchTool}
                className="text-lg px-8 py-6"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch Planning Tool
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onRequestDemo}
                className="text-lg px-8 py-6"
              >
                <BarChart className="w-5 h-5 mr-2" />
                Request Enterprise Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Foresight Section */}
      <section className="py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl">
                Strategic Foresight: Trust, Compliance, and Risk Mitigation
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Transform every proposal into a risk-proofing layer that ensures
                fiscal and regulatory integrity. Genisys Citylabs provides a
                single source of truth, eliminating delays and protecting
                stakeholders from costly oversights.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Financial Integrity */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">Financial Integrity</h3>
                    <p className="text-muted-foreground">
                      Validation guardrails prevent cost and revenue input
                      errors, ensuring every calculation meets fiscal compliance
                      standards from day one.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2: Spatial Reliability */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">Spatial Reliability</h3>
                    <p className="text-muted-foreground">
                      Seamlessly integrate with municipal GIS systems via
                      GeoJSON/KML formats, ensuring geospatial accuracy and
                      alignment with existing infrastructure data.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 3: Regulatory Alignment */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">Regulatory Alignment</h3>
                    <p className="text-muted-foreground">
                      Guarantee compliance with masterplan mandates for density,
                      unit mix, and land use distribution—eliminating approval
                      delays and regulatory risks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Maximize Potential Section */}
      <section className="py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl">
                Maximize Potential: Instant Optimization & Audit-Ready Metrics
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Test hundreds of scenario permutations in real-time to identify
                optimal outcomes. Generate audit-ready metrics that satisfy both
                public accountability and private sector ROI requirements.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Financial Velocity */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">Financial Velocity</h3>
                    <p className="text-muted-foreground">
                      Calculate Net Profit, ROI, and Break-even Years
                      instantly—empowering stakeholders to make data-driven
                      decisions without delays.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2: Scenario Mastery */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">Scenario Mastery</h3>
                    <p className="text-muted-foreground">
                      Dynamically adjust development parameters to optimize GFA,
                      unit mix, and land use distribution—maximizing project
                      potential with every iteration.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 3: System Integration */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">System Integration</h3>
                    <p className="text-muted-foreground">
                      Export comprehensive data via CSV and access dedicated API
                      endpoints for enterprise-level data flow and workflow
                      automation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl">
                Ready to Transform Your Urban Planning Process?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join municipal officials, planners, and developers who trust
                Genisys Citylabs to deliver standardized, validated metrics for
                every project.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onLaunchTool}
                className="text-lg px-8 py-6"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch Planning Tool
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onRequestDemo}
                className="text-lg px-8 py-6"
              >
                <BarChart className="w-5 h-5 mr-2" />
                Request Enterprise Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">
            <p>
              <strong>Professional Disclaimer:</strong> This tool provides
              estimates for planning purposes only. Actual development
              parameters may vary based on local regulations and site
              conditions.
            </p>
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            © 2025 Genisys Citylabs v1.0 Phase 1c
          </div>
        </div>
      </footer>
    </div>
  );
}
