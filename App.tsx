import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tracks from "./pages/Tracks";
import TrackDetail from "./pages/TrackDetail";
import ModuleDetail from "./pages/ModuleDetail";
import ChatPage from "./pages/ChatPage";
import Templates from "./pages/Templates";
import Progress from "./pages/Progress";
import DashboardLayout from "./components/DashboardLayout";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/app">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/app/tracks">
        <DashboardLayout>
          <Tracks />
        </DashboardLayout>
      </Route>
      <Route path="/app/tracks/:trackId">
        {(params) => (
          <DashboardLayout>
            <TrackDetail trackId={params.trackId} />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/app/tracks/:trackId/:moduleId">
        {(params) => (
          <DashboardLayout>
            <ModuleDetail trackId={params.trackId} moduleId={params.moduleId} />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/app/chat">
        <DashboardLayout>
          <ChatPage />
        </DashboardLayout>
      </Route>
      <Route path="/app/chat/:chatId">
        {(params) => (
          <DashboardLayout>
            <ChatPage chatId={params.chatId} />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/app/templates">
        <DashboardLayout>
          <Templates />
        </DashboardLayout>
      </Route>
      <Route path="/app/progress">
        <DashboardLayout>
          <Progress />
        </DashboardLayout>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
